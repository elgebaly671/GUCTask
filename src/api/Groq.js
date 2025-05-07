import { Groq } from 'groq-sdk';

const groq = new Groq();
async function main() {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "user",
        "content": "Instruction:\nAnalyze the following course announcements carefully.\nExtract and organize the key information into a structured JSON format.\n\nExtract the following fields:\n\nCourse Name (e.g., \"Math-401\")\n\nFor each announcement item:\n\nType (Assignment, Quiz, Exam, or Other)\n\nTitle (e.g., Assign-1, Quiz-2, Mid-Term Exam)\n\nRelevant Lectures (list of lecture numbers if mentioned)\n\nRelevant Worksheets (list of worksheet numbers if mentioned)\n\nDeadline (date or week mentioned)\n\nNotes (any additional important notes)\n\nRules:\n\nIf a field is missing, set it to null.\n\nDates should match exactly as written (e.g., \"22nd of February, 2025\").\n\nFocus only on the clearly mentioned data.\n\nKeep it general, not specific to any course type.\n\nExample input:\n1- Dear 4th semester MET/IET students. Welcome to Math-401, one of the most interesting courses you study at GUC.\n\n2- Assign-1: is now available. The deadline of submission is the week starting 22nd of February, 2025. To be submitted to your TA in his/her office.\n\n3- Quiz-1: will be in the math tutorials of the week staring 1st of March, 2025. It will cover: Lectures ( 1, 2, and 3) + Worksheets (1, 2, and 3).\n\n4- Assign-2: is now available. The deadline of submission is the week starting 8th of March, 2025. To be submitted to your TA in his/her office.\n\n5- Mid-Term Exam: will cover: Lectures (1, 2, 3, 4, 5, and 6) + Worksheets (1, 2, 3, 4, and 5). I wish you all the best.\n\n6- Assign-3: is now available. The deadline of submission is the week starting 12th of April, 2025. To be submitted to your TA in his/her office.\n\n7- Quiz-2: will be in the math tutorials of the week staring 22nd of April, 2025. It will cover: Lectures ( 4, 5, 6 and 7) + Worksheets (4, 5, 6 and 7).\n\n8- Assign-4: is now available. The deadline of submission is the week starting 3rd of May, 2025. To be submitted to your TA in his/her office.\n\n9- Quiz-3: will be in the math tutorials of the week staring 6th of May, 2025. It will cover: Lectures ( 7, 8, and 9) + Worksheets (7, 8, and 9).\n"
      },
      {
        "role": "assistant",
        "content": "Here is the extracted information in JSON format:\n\n```\n{\n  \"Course Name\": \"Math-401\",\n  \"Announcements\": [\n    {\n      \"Type\": \"Assignment\",\n      \"Title\": \"Assign-1\",\n      \"Relevant Lectures\": null,\n      \"Relevant Worksheets\": null,\n      \"Deadline\": \"the week starting 22nd of February, 2025\",\n      \"Notes\": \"To be submitted to your TA in his/her office\"\n    },\n    {\n      \"Type\": \"Quiz\",\n      \"Title\": \"Quiz-1\",\n      \"Relevant Lectures\": [1, 2, 3],\n      \"Relevant Worksheets\": [1, 2, 3],\n      \"Deadline\": \"the week starting 1st of March, 2025\",\n      \"Notes\": null\n    },\n    {\n      \"Type\": \"Assignment\",\n      \"Title\": \"Assign-2\",\n      \"Relevant Lectures\": null,\n      \"Relevant Worksheets\": null,\n      \"Deadline\": \"the week starting 8th of March, 2025\",\n      \"Notes\": \"To be submitted to your TA in his/her office\"\n    },\n    {\n      \"Type\": \"Exam\",\n      \"Title\": \"Mid-Term Exam\",\n      \"Relevant Lectures\": [1, 2, 3, 4, 5, 6],\n      \"Relevant Worksheets\": [1, 2, 3, 4, 5],\n      \"Deadline\": null,\n      \"Notes\": \"I wish you all the best\"\n    },\n    {\n      \"Type\": \"Assignment\",\n      \"Title\": \"Assign-3\",\n      \"Relevant Lectures\": null,\n      \"Relevant Worksheets\": null,\n      \"Deadline\": \"the week starting 12th of April, 2025\",\n      \"Notes\": \"To be submitted to your TA in his/her office\"\n    },\n    {\n      \"Type\": \"Quiz\",\n      \"Title\": \"Quiz-2\",\n      \"Relevant Lectures\": [4, 5, 6, 7],\n      \"Relevant Worksheets\": [4, 5, 6, 7],\n      \"Deadline\": \"the week starting 22nd of April, 2025\",\n      \"Notes\": null\n    },\n    {\n      \"Type\": \"Assignment\",\n      \"Title\": \"Assign-4\",\n      \"Relevant Lectures\": null,\n      \"Relevant Worksheets\": null,\n      \"Deadline\": \"the week starting 3rd of May, 2025\",\n      \"Notes\": \"To be submitted to your TA in his/her office\"\n    },\n    {\n      \"Type\": \"Quiz\",\n      \"Title\": \"Quiz-3\",\n      \"Relevant Lectures\": [7, 8, 9],\n      \"Relevant Worksheets\": [7, 8, 9],\n      \"Deadline\": \"the week starting 6th of May, 2025\",\n      \"Notes\": null\n    }\n  ]\n}\n```"
      }
    ],
    "model": "llama3-70b-8192",
    "temperature": 1,
    "max_completion_tokens": 1024,
    "top_p": 1,
    "stream": true,
    "stop": null
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main();