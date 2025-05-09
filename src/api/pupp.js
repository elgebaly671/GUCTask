import puppeteer, { Browser } from "puppeteer";
import pkg from 'groq-sdk';
import 'dotenv/config.js'
const {Groq} = pkg


const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
const main = async (data) => {
 
 const announcement = data.filter(item => item.Anouncontent?.trim())
 .map(item => `Course: ${item.courseName}\n${item.Anouncontent}`).join("\n\n");
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Instruction:\nAnalyze the following course announcements carefully.\nExtract and organize the key information into a structured JSON format.\n\nExtract the following fields:\n\nCourse Name (e.g., "Math-401")\n\nFor each announcement item:\n\nType (Assignment, Quiz, Exam, or Other)\nTitle (e.g., Assign-1, Quiz-2, Mid-Term Exam)\nRelevant Lectures (list of lecture numbers if mentioned)\nRelevant Worksheets (list of worksheet numbers if mentioned)\nDeadline (date or week mentioned)\nNotes (any additional important notes)\n\nRules:\nIf a field is missing, set it to null.\nDates should match exactly as written (e.g., "22nd of February, 2025").\nFocus only on the clearly mentioned data.\nKeep it general, not specific to any course type; Just give me the final repsonse without any side notes or any othe phrases, only the final JSON thing.\n\nInput:\n${announcement}`
        }
      ],
      model: "llama3-70b-8192",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    });
    

      console.log("Chat completion response:", chatCompletion);  // Log the full response
      if (chatCompletion.choices && chatCompletion.choices[0]) {
        const messageContent = chatCompletion.choices[0]?.message?.content;
      console.log(messageContent)
        // Extract content inside triple backticks
        const match = messageContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      
        if (match && match[1]) {
          let jsonString = match[1].trim();
      
          // Fix: remove trailing non-JSON characters after final closing bracket
          const lastBrace = Math.max(jsonString.lastIndexOf("}"), jsonString.lastIndexOf("]"));
          if (lastBrace !== -1) {
            jsonString = jsonString.slice(0, lastBrace + 1);
          }
      
          try {
            console.log(jsonString)
            const parsed = JSON.parse(jsonString);
            console.log(" Parsed JSON:", parsed);
          } catch (err) {
            console.error(" Still failed to parse JSON:", err);
            console.log(" Extracted string:", jsonString);
          }
        } else {
          console.error(" No JSON block found.");
          console.log(" Message content:", messageContent);
        }
      } else {
        console.error(" No choices or message content.");
      }
      
      
  } catch (error) {
      console.error("Error during Groq API request:", error);
  }
};


const getData = async (username, password)=> {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.authenticate({
        username,
        password
    })
    await page.goto("https://cms.guc.edu.eg", {waitUntil:'networkidle2'});
    const activeCourses = await getActiveCourses(page);
    console.log(activeCourses);
    const data = await getAnnouncement(page,activeCourses);
    await main(data);
    await browser.close();
    return activeCourses;
};
const getActiveCourses = async (page) => {
    await page.waitForSelector('#ContentPlaceHolderright_ContentPlaceHoldercontent_GridViewcourses');

    const activeCourses = await page.$$eval('#ContentPlaceHolderright_ContentPlaceHoldercontent_GridViewcourses td:nth-child(2)', tds =>
        tds.map(td => td.innerText.trim())
    );

    return activeCourses;
}
const getAnnouncement = async (page, courses) => {
  let data = [];
  
  for (let i = 0; i < courses.length; i++) {
    const buttons = await page.$$('.btn-danger'); // Re-select buttons after each nav

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      buttons[i].click()
    ]);

    await page.waitForSelector('#ContentPlaceHolderright_ContentPlaceHoldercontent_desc');

    // Get innerText of all <p> children and join them with line breaks
    const content = await page.$$eval(
      '#ContentPlaceHolderright_ContentPlaceHoldercontent_desc p',
      ps => ps.map(p => p.innerText.trim()).join('\n')
    );

    data.push({
      courseName: courses[i],  // also fixed typo from "coueseName"
      Anouncontent: content
    });

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.goBack()
    ]);
  }

  console.log(data);
  return data
};


export default getData;
