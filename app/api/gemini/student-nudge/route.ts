import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getStudentById } from '@/lib/data/students';

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json();
    if (!studentId || typeof studentId !== 'string') {
      return NextResponse.json({ error: 'Valid anonymized student token required' }, { status: 400 });
    }

    const student = getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: 'Student record not found' }, { status: 404 });
    }

    // PRIVACY & DPDP RULE: Zero PII sent to LLM
    // Extract only anonymized behavioral and academic signals
    const anonymizedPayload = {
      anonymizedId: student.id,
      major: student.major,
      currentSemester: student.currentSemester,
      observedHabits: {
        attendanceRate: `${student.overallAttendanceRate}%`,
        lateSubmissionRate: `${student.lateSubmissionRate}%`,
        lmsEngagement: `${student.lmsEngagementScore}/100`,
      },
      topFactors: student.risk.topFactors.map((f) => f.factor),
      verifiedStrengths: [
        student.overallAttendanceRate >= 75 ? 'Consistent in-person lecture attendance' : 'Demonstrated persistence in coursework',
        'Strong potential in foundational degree track',
      ],
    };

    const prompt = `You are a warm, empathetic academic advisor drafting a supportive check-in email for a university student.
CRITICAL TONE REQUIREMENTS:
- Use supportive, asset-based, non-judgmental language. NEVER use words like "at-risk", "failing", "probation", "warning", or deficit labels.
- Acknowledge their strengths and hard work first.
- Normalize that university coursework gets demanding and overwhelming.
- Gently invite them for a low-pressure 15-minute check-in or virtual tea/coffee.
- Suggest 2 manageable, constructive resources (like peer study sessions or flexible deadline planning).
- Keep it concise, genuine, and encouraging (under 180 words).

STUDENT PROFILE (ANONYMIZED):
${JSON.stringify(anonymizedPayload, null, 2)}

Output format:
SUBJECT: [Friendly, encouraging subject line]
BODY: [Empathetic email body]`;

    const antiHallucinationNote =
      'Strict PII Sanitization & Persona Anchoring: All demographic identifiers (names, emails, gender, income) were scrubbed prior to API transmission. The prompt uses behavioral asset framing to prevent negative deficit-label hallucinations.';

    let rawText = '';
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        rawText = response.text || '';
      } catch (err) {
        console.warn('Gemini API call failed, using deterministic supportive draft:', err);
      }
    }

    let subject = `Checking in and celebrating your progress this term!`;
    let body = `Hi there,\n\nI wanted to reach out and congratulate you on your steady commitment in your ${student.major} courses this semester! Navigating college coursework takes real dedication, and I really admire your persistence.\n\nMid-semester schedules can sometimes feel intense, and I noticed deadlines have been piling up quickly recently. I'd love to connect for a casual 15-minute chat this week—no agenda, just to see how you're feeling and how I can help support your goals.\n\nWhether it's connecting with our weekly peer study sessions or helping adjust your assignment schedule, we have great resources here for you.\n\nLet me know what time works best for you, or drop by during my office hours on Thursday!\n\nWarmly,\nYour Academic Advisor`;

    if (rawText) {
      const matchSubject = rawText.match(/SUBJECT:\s*(.+)/i);
      const matchBody = rawText.match(/BODY:\s*([\s\S]+)/i);
      if (matchSubject && matchSubject[1]) {
        subject = matchSubject[1].trim();
      }
      if (matchBody && matchBody[1]) {
        body = matchBody[1].trim();
      } else {
        body = rawText;
      }
    }

    return NextResponse.json({
      studentId: student.id,
      draftSubject: subject,
      draftBody: body,
      anonymizedPayload,
      promptUsed: prompt,
      antiHallucinationNote,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
