//initialize jspsych
const jsPsych = initJsPsych({
    fullscreen: true,
    //display data at the end of the experiment
    on_finish: function() {
        jsPsych.data.displayData();
    }
});

// Define the total number of stimuli
const totalStimuli = stimuli_variables.length;
const numRandomTrials = 30;
const practiceStimuli = jsPsych.randomization.sampleWithoutReplacement(stimuli_variables, numRandomTrials);
const experimentStimuli = stimuli_variables.filter(stimulus => !practiceStimuli.includes(stimulus));

//create timeline
var timeline = [];


/* Stores info received by Pavlovia */
var pavloviaInfo;

/* init connection with pavlovia.org */
var pavlovia_init = {
  type: jsPsychPavlovia,
  command: "init",
  // Store info received by Pavlovia init into the global variable `pavloviaInfo`
  setPavloviaInfo: function (info) {
    console.log(info);
    pavloviaInfo = info;
  }
};
timeline.push(pavlovia_init);


//enter fullscreen mode

var enter_fullscreen = {
    type: jsPsychFullscreen,
    stimulus: 'This trial launch in fullscreen mode when you click the button below.',
    choices: ['Continue']
  }
  timeline.push(enter_fullscreen);

var trial = {
    type: jsPsychVirtualChinrest,
    blindspot_reps: 3,
    resize_units: "none"
};

const randomCode = generateRandomCode(5); // Change to the desired code length

// Add the random code to the subject ID
var subject_id = randomCode;
// This adds a property called 'subject' and a property called 'condition' to every trial
jsPsych.data.addProperties({
  subject: subject_id,
});

// Function to generate a random completion code
function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

 var welcome = {
    timeline: [
       
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus:
                "<h2>Welcome to the experiment.</h2>" +
                "<p>" +
                "This experiment should take roughly 30 minutes to complete." +
                "</p>" +
                "<p>" +
                "First, you will fill out a short questionnaire. After the " +
                "questionnaire, we will assess your reading level in Arabic." +
                "</p>" +
                "<p>" +
                "Following this, you will be ready to begin the experiment." +
                "</p>" +
                "<p>" +
                "Press any key to continue." +
                "</p>",
            post_trial_gap: 500 // Add a gap after the welcome screen (in milliseconds)
        },
        {
            type: jsPsychSurveyText,
            questions: [
                { prompt: 'What is your age?', name: 'age', placeholder: '21' },
                { prompt: 'Please enter your email address', name: 'email', placeholder: 'aa100@nyu.edu' },
                { prompt: 'What is your present country of residence?', name: 'country', placeholder: 'United Arab Emirates'}
            ]
        }
    ]
};


timeline.push(welcome);

var consent = {
    timeline: [
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: consent_trial,
            choices: ['Yes', 'No'],
            required: true,
            post_trial_gap: 500, // Adjust as needed
        }
    ],
    timeline_variables: consent_trial, // Assuming consent_trial contains the 'sentence' property
};

timeline.push(consent);



var demographics = {
  timeline: [
    { 
      type: jsPsychSurveyMultiChoice,
      questions: [
        {
          prompt: "What is your biological sex?", 
          name: 'BiologicalSex', 
          options: ['Male', 'Female', 'Other'], 
          required: true
        }, 
        {
          prompt: "Do you have dyslexia?",
          name: 'Dyslexia',
          options: ['Yes', 'No'],
          required: true
        },
        {
            prompt: "Do you wear corrective lenses?",
            name: 'Lens',
            options: ['Yes, eyeglasses', 'Yes, contact lenses', 'No', 'Unsure'],
            required: true
          },
        {
          prompt: "Which is your dominant hand?", 
          name: 'DomHand', 
          options: ['Left', 'Right'], 
          required: true
        },
        {
          prompt: "Were you born and raised in a multilingual environment?",
          name: 'MultEnv',
          options: ['Yes', 'No'],
          required: false
        },
        {
          prompt: "Is Arabic your first language?",
          name: 'ArabFirst',
          options: ['Yes', 'No'],
          required: true
        },
        {
          prompt: "Which dialect of Arabic is your native dialect?",
          name: 'ArabicDialect',
          options: ['Egyptian', 'Levantine (Palestine, Syria, Lebanon, Jordan)', 'Iraqi', 'North African (Morocco, Algeria, Tunisia, Libya)', 'Sudanese', 'Gulf/Khaliji (UAE, Saudi Arabia, Kuwait, Bahrain, Qatar, Oman, Yemen)', 'Other'],
          required: true
        },
        {
          prompt: "On a scale from 0% to 100%, where 0% means you never use Arabic in your daily life, and 100% means you speak Arabic exclusively, how would you rate the frequency with which you <b>speak Arabic</b> in your day-to-day activities?",
          name: 'SpeakinArabic',
          options: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
          required: true
        },
        {
          prompt: "On a scale from 0% to 100%, where 0% means you never read Arabic in your daily life, and 100% means you read in Arabic exclusively, how would you rate the frequency with which you <b>read in Arabic</b> in your day-to-day activities?",
          name: 'ReadinArabic',
          options: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
          required: true
        },
        {
          prompt: "On a scale from 0% to 100%, where 0% means you never write in Arabic in your daily life, and 100% means you write Arabic exclusively, how would you rate the frequency with which you <b>write in Arabic</b> in your day-to-day activities?",
          name: 'WriteinArabic',
          options: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
          required: true
        },

      ],
    }
  ]
};
timeline.push(demographics);

var instruction_screen_practice = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>" +
        "You are now going to see Arabic sentences on the screen, one after " +
        "the other. Each sentence is broken up into words. You can " +
        "reveal the sentence word-by-word by <b>repeatedly hitting " +
        "the spacebar.</b> " +
        "After reading, you will see a question. You will have " +
        "to indicate whether the statement is correct or not. " +
        "It is important that you really <i>read</i> " +
        "each sentence." +
        "</p>" +
        "<p>" +
        "<i>Press any key when ready to start.</i>" +
        "</p>",
    response_ends_trial: true,
    on_finish: function (data) {
        data.rt = Math.round(data.rt);
    }
};

timeline.push(instruction_screen_practice);

var spr_timeline = {
    timeline: [ 
    {
        type: jsPsychSelfPacedReading,
        sentence: jsPsych.timelineVariable('sentence'), // Use 'sentence' instead of 'Target'
        mask_on_word: true,
        mask_colour: 'grey',
        font_size: '24pt',
        canvas_size: [1280, 800],
        css_classes: ['rtl-text'] // Apply the CSS class for right-to-left text

    },
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: function () {
                var question = jsPsych.timelineVariable('question');
                return '<div style="font-size: 24px;">' + question + '</div>';
            },
            choices: function () {
                var choices = jsPsych.timelineVariable('choices');
                return choices.map(choice => '<div style="font-size: 16px;">' + choice + '</div>');
            },
            correct: jsPsych.timelineVariable('correct'),
            data: {
                condition: 'self_paced_reading',
                correct_response: jsPsych.timelineVariable('correct'),
            },
            
            on_finish: function (data) {
                console.log("Response: ", data.response);
                console.log("Correct Response: ", data.correct_response);
                // Assuming data.correct_response and data.response are present in your data
                data.question_response = data.response === data.correct_response;
                data.correct = data.response === data.correct_response;
                console.log("Timeline after question_screen:", jsPsych.data.get());
            },
        },
        {
            type: jsPsychHtmlKeyboardResponse,
            trial_duration: 1000,
            stimulus: function () {
                // Check the correctness of the last response
                if (jsPsych.data.get().last(1).select('correct').values[0] == true) {
                    return "<p>Correct!</p>"; // Return the feedback
                } else {
                    return "<p>Incorrect.</p>"; // Return the feedback
                }
            },
        }
    ],
    timeline_variables: practice_items, // Assuming practice_items contains the 'sentence' property
    randomize_order: false, // Set to true if you want to randomize the order
    repetitions: 1,
};


    // Add a new trial after spr_timeline to change direction back to ltr
var changeDirectionToLTR = {
            type: jsPsychHtmlKeyboardResponse,
          stimulus: "<p>" +
        "A passage will be presented on the screen, and your task is to read it at a comfortable pace." +
        "</p>" +
        "<p>" +
        "Once you've finished reading, additional instructions or questions may follow." +
        "</p>" +
        "<p>" +
        "Press any key to begin." +
        "</p>",
            on_start: function () {
                document.querySelector('body').classList.remove('rtl-text');
                document.querySelector('body').classList.add('ltr-text');
            }
        };

        // Add the changeDirectionToLTR trial to the end of your timeline
        timeline.push(changeDirectionToLTR);
 
var natural_timeline = {
    timeline: [
        {
            type: jsPsychHtmlKeyboardResponse,
           stimulus: "<div style='font-size: 32px; line-height: 1.5;'> .يعمل الإنسان على استغلال موارد الطبيعة لبناء تقدمه وحضارته، إلا أن استغلاله المفرط لهذه الموارد يتم بطرق خاطئة الأمر الذي أدى إلى اختلال التوازن البيئي، وأضر البيئة بشكل عام، فأصبحت ضعيفة هشة لا تستطيع الوفاء بمتطلباته. وقد دأبت دول كثيرة تعتمد على الزراعة كمصدر للدخل إلى التركيز على زراعة الأرض أكثر من مرة في السنة الواحدة، مما أدى إلى .إجهاد تربتها، إضافة إلى إزالة أجزاء كبيرة من الغابات التي تعتبر مأوى الحياة البرية فأضر ذلك بها وقلل من أعدادها بدرجة كبيرة.</div><p style='font-style: italic;'>Press enter when you're done reading</p>",
            choices: ['Enter'],
            response_ends_trial: true
        },
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: "<p style='font-size: 24px;'>هل زراعة الأرض أكثر من مرة في السنة الواحدة تقوي التربة؟</p>",
            choices: ['<span style="font-size: 16px;">نعم</span>', '<span style="font-size: 16px;">لا</span>'],
            correct: 1,
            data: {
                part: 'practice',
                condition: 'natural reading',
                id: 4,
                correct_response: 1,
            },
            on_finish: function (data) {
                console.log("Response: ", data.response);
                console.log("Correct Response: ", data.correct_response);
                // Assuming data.correct_response and data.response are present in your data
                data.question_response = data.response === data.correct_response;
                data.correct = data.response === data.correct_response;
                console.log("Timeline after question_screen:", jsPsych.data.get());
            }
        },
        {
            type: jsPsychHtmlKeyboardResponse,
            trial_duration: 1000,
            stimulus: function () {
                // Check the correctness of the last response
                if (jsPsych.data.get().last(1).select('correct').values[0] == true) {
                    return "<p>Correct!</p>"; // Return the feedback
                } else {
                    return "<p>Incorrect.</p>"; // Return the feedback
                }
            }
        }
    ]
};
var startExperiment = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>You're done with the Arabic reading assessment and ready to begin the experiment.</p>
             <p>Press any key to read the instructions.</p>`,
};
timeline.push(startExperiment);


  //define instructions & add 2 second gap afterwards
        var instructions = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
            <p><b>Instructions:</b></p>
            <p>Each trial will start with a group of hash marks (######) followed by a word that will appear briefly in the center of the screen.</p>
            <p>Your task is to quickly determine the <strong>position</strong> where the word is printed.</p>
            <p>Press <strong>A</strong> if the word is on the left, and <strong>L</strong> if it's on the right.</p>
            <p>React as fast as you can! Press any key to start the practice round.</p>
              `,
            post_trial_gap: 2000,
        };
        timeline.push(instructions);

  //define fixation
        var fixation = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div style="font-size:60px;">######</div>',
            choices: 'NO_KEYS',
            trial_duration: 895,
            task: 'fixation',
        };
        
//define trial stimuli array for timeline variables 
       
  

 //define test trial
 var test = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
    var html = `<p style="font-size:60px; font-family: Arial;">
    ${jsPsych.timelineVariable('Target')}</p>`;
    return html;
      },
    choices: ["a","l"],
    trial_duration: 67,
};

// Define the blank screen
        var blank_screen = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '',
             trial_duration: 30,
            };

// Define the backward mask (same as the forward mask)
         var backward_mask = {
           type: jsPsychHtmlKeyboardResponse,
          stimulus: '<div style="font-size:60px;">######</div>',
          trial_duration: 0, // Immediate display
             };


    var response_alternatives = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        var target = jsPsych.timelineVariable('Target');
        var probe = jsPsych.timelineVariable('Probe');
        var targetPosition = jsPsych.timelineVariable('Target_Position');
        var probePosition = jsPsych.timelineVariable('Probe_Position');
        var swapOrder = Math.random() < 0.5; // 50% chance of swapping
        var leftKey = 'a';
        var rightKey = 'l';

 // Conditionally switch the positions based on Probe_Position and Target_Position
        var targetHtml = `<div style="position: absolute; bottom: 200px; text-align: center; font-size:60px;">${target}</div>`;
        var probeHtml = `<div style="position: absolute; bottom: 200px; text-align: center; font-size:60px;">${probe}</div>`;

        if (targetPosition === 'Left') {
            targetHtml = `<div style="position: absolute; bottom: 200px; text-align: center; font-size:60px; left: 200px;">${target}</div>`;
        } else if (targetPosition === 'Right') {
            targetHtml = `<div style="position: absolute; bottom: 200px; text-align: center; font-size:60px; right: 200px;">${target}</div>`;
        }

        if (probePosition === 'Left') {
            probeHtml = `<div style="position: absolute; bottom: 200px; text-align: center; font-size:60px; left: 200px;">${probe}</div>`;
        } else if (probePosition === 'Right') {
            probeHtml = `<div style="position: absolute; bottom: 200px; text-align: center; font-size:60px; right: 200px;">${probe}</div>`;
        }

        return `
            ${targetHtml}
            ${probeHtml}
            <div style="font-size:60px;">######</div>
        `;
    },
    choices: ['a', 'l'],
    trial_duration: 5000, // Allow a maximum of 5 seconds for response
    data: {
            task: 'response',
            color: 'black',
            position: jsPsych.timelineVariable('Position'),
            target: jsPsych.timelineVariable('Target'),
            probe: jsPsych.timelineVariable('Probe'),
            correct_response: jsPsych.timelineVariable('Target'),
            target_position: jsPsych.timelineVariable('Target_Position'),
            probe_position: jsPsych.timelineVariable('Probe_Position'),
            target_freq: jsPsych.timelineVariable('Target_Occurrences'),
            probe_freq:  jsPsych.timelineVariable('Probe_Occurrences'),
            target_root: jsPsych.timelineVariable('Target_Root'),
            probe_root: jsPsych.timelineVariable('Probe_Root'),
            target_rootfreq:jsPsych.timelineVariable('Target_RootFreq'),
            probet_rootfreq:jsPsych.timelineVariable('Probe_RootFreq'),
            target_gloss:jsPsych.timelineVariable('Target_Gloss'),
            probe_gloss: jsPsych.timelineVariable('Probe_Gloss')
    
    },
    on_finish: function (data) {
        var targetPosition = data.target_position;
        var responseKey = data.response;

        // Check if the participant's response key matches the target position
        data.correct = (targetPosition === 'Left' && responseKey === 'a') ||
                       (targetPosition === 'Right' && responseKey === 'l');
    },
};
    
var feedback = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 1000,
  stimulus: function(){
    // Check if the response is null
    var last_trial_response = jsPsych.data.get().last(1).values()[0].response;
    if(last_trial_response === null){
      return "<p>No response entered.</p>";
    }

    // Check the accuracy of the last response
    var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if(last_trial_correct){
      return "<p>Correct!</p>"; // the parameter value has to be returned from the function
    } else {
      return "<p>Incorrect.</p>"; // the parameter value has to be returned from the function
    }
  }
}

       
// Debrief block
var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        // Get all trials with a "response" task
        var trials = jsPsych.data.get().filter({ task: 'response' });

        // Calculate accuracy by comparing participants' responses with the correct responses
        var correct_responses = trials.select('correct_response');
        var participant_responses = trials.select('response');
        var correct_count = 0;

        for (var i = 0; i < trials.count(); i++) {
            var correct = trials.select('correct').values[i];

            // Check if the participant's response was correct
            if (correct) {
                correct_count++;
            }
        }

        var accuracy = Math.round((correct_count / trials.count()) * 100);

        // Calculate average response time for all trials
        var rt = Math.round(trials.select('rt').mean());

        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
        <p>Your average response time was ${rt}ms.</p>
        <p>Press any key to complete the experiment. Thank you!!</p>`;
    }
};
timeline.push(debrief_block);

// Debrief block after the practice block
var practice_debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        // Get all trials with a "response" task from the practice block
        var practice_trials = jsPsych.data.get().filter({ task: 'response' }); // Adjust the timeline index if needed

        // Calculate accuracy by comparing participants' responses with the correct responses
        var practice_correct_responses = practice_trials.select('correct_response');
        var participant_responses = practice_trials.select('response');
        var correct_count = 0;

        for (var i = 0; i < practice_trials.count(); i++) {
            var correct = practice_trials.select('correct').values[i];
            // Check if the participant's response was correct
            if (correct) {
                correct_count++;
            }
        }

        var prac_accuracy = Math.round((correct_count / practice_trials.count()) * 100);

        // Calculate average response time for all practice trials
        var prac_rt = Math.round(practice_trials.select('rt').mean());

        return `<p>You responded correctly on ${prac_accuracy}% of the practice trials.</p>
        <p>Your average response time was ${prac_rt}ms.</p>
        <p>Press the spacebar to start the main experiment. Thank you!!</p>`;
    }
};


 // Combine the endPracticeMessage and practice_procedure in a single timeline
var practice_timeline =  {
    timeline: [fixation, test, blank_screen, backward_mask, response_alternatives, feedback],
    timeline_variables: practiceStimuli,
    randomize_order: true,
    repetitions: 1,
};

var separatorMessage = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Now, it's time for the main experiment.</p>
        <p>You will go through a total of 5 blocks with short breaks in between.</p>
        <p>Press any key to start the main experiment.</p>`,
};

var endMessage = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<p>You're done with the experiment.</p>
        <p>Press any key to exit.</p>`,
    trial_duration: 3000,
};


var chunk_debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        // Get all trials with a "response" task from the current chunk
        var chunk_trials = jsPsych.data.get().filter({ task: 'response' }).last(30); // Adjust the timeline index if needed

        // Calculate accuracy by comparing participants' responses with the correct responses
        var chunk_correct_responses = chunk_trials.select('correct_response');
        var participant_responses = chunk_trials.select('response');
        var correct_count = 0;

        for (var i = 0; i < chunk_trials.count(); i++) {
            var correct = chunk_trials.select('correct').values[i];
            // Check if the participant's response was correct
            if (correct) {
                correct_count++;
            }
        }

        var chunk_accuracy = Math.round((correct_count / chunk_trials.count()) * 100);

        // Calculate average response time for all trials in the current chunk
        var chunk_rt = Math.round(chunk_trials.select('rt').mean());

        // Get the block number, considering the practice trials
        var block_number = (Math.ceil(jsPsych.data.get().filter({ task: 'response' }).count() / 30)-1);

        return `<p><b>Block ${block_number} accuracy:</b> ${chunk_accuracy}%.</p>
                <p><b>Average response time for the last 30 trials:</b> ${chunk_rt}ms.</p>
                <p>Press any key to continue.</p>`;
    },
};

// Create a timeline with a single trial displaying the completion code
// Create a timeline with a single trial displaying the completion code
const completionCodeTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<p>Your completion code is: <b>${randomCode}</b>.</p> Please copy and enter the completion code in this survey to receive your payment. When you're done, press the spacebar or click the link below to exit.</p><a href="https://nyu.qualtrics.com/jfe/form/SV_6QdM3m1mA0YBlH0" target="_blank">Survey</a>`;
  },
  choices: ['space'],
  response_ends_trial: true,
  trial_duration: 30000
};

var main_procedure = {
    timeline: [
        fixation, 
            test,
        blank_screen, 
        backward_mask, 
        response_alternatives, 
        feedback,
        { 
            conditional_function: function () {
                return jsPsych.data.get().filter({ task: 'response' }).count() % 30 === 0;
            },
            timeline: [chunk_debrief_block],
        }
    ],
    timeline_variables: experimentStimuli,
    randomize_order: true,
    repetitions: 1, // Run through all  trials once
};
/* finish connection with pavlovia.org */
var pavlovia_finish = {
    type: jsPsychPavlovia,
    command: "finish",
    participantId: "JSPSYCH-DEMO",
    // Thomas Pronk; your filter function here
    dataFilter: function(data) {
      // Printing the data received from jsPsych.data.get().csv(); a CSV data structure
      console.log(data);
      // You can also access the data directly, for instance getting it as JSON
      console.log(jsPsych.data.get().json());
      // Return whatever data you'd like to store
      return data;
    },
    // Thomas Pronk; call this function when we're done with the experiment and data reception has been confirmed by Pavlovia
    completedCallback: function() {
      alert('data successfully submitted!');
    }
  };

  timeline.push(pavlovia_finish);


// Define the full timeline
var experimentTimeline = [
pavlovia_init,
enter_fullscreen,
trial,
consent,
welcome,
demographics,
instruction_screen_practice,
spr_timeline,
changeDirectionToLTR,
natural_timeline,
startExperiment,
    instructions,
    practice_timeline,  // Include the practice timeline
    practice_debrief_block,
    separatorMessage,
    main_procedure,
    debrief_block,
    completionCodeTrial,
    endMessage,
    pavlovia_finish
    
];

var version = jsPsych.version();
console.log(version);

// Start the experiment
jsPsych.run(experimentTimeline);
