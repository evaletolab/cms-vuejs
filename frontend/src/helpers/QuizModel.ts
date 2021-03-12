function isQuestionBtnCorrect(questionBtn){

    if (questionBtn.hasAttribute('data-correct-answer') && !questionBtn.classList.contains('active')) {
        return false;
    }

    if (questionBtn.classList.contains('active') && !questionBtn.hasAttribute('data-correct-answer')) {
        return false;
    }

    return true;
}

function vuIcon(color){

    const ico =  `
<?xml version="1.0" encoding="utf-8"?>
<svg class="btn-icon" version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 87 87" style="enable-background:new 0 0 87 87;" xml:space="preserve">
<g>
	<g>
		<path style="fill: ${color}" d="M43.5,7.56c9.6,0,18.63,3.74,25.41,10.53C75.7,24.87,79.44,33.9,79.44,43.5S75.7,62.13,68.91,68.91
			C62.13,75.7,53.1,79.44,43.5,79.44S24.87,75.7,18.09,68.91C11.3,62.13,7.56,53.1,7.56,43.5s3.74-18.63,10.53-25.41
			C24.87,11.3,33.9,7.56,43.5,7.56 M43.5,0C19.48,0,0,19.48,0,43.5S19.48,87,43.5,87S87,67.52,87,43.5S67.52,0,43.5,0L43.5,0z"/>
	</g>
	<g>
		<path style="fill: ${color}" d="M36.51,67.09c-1.6,0-3.11-0.76-4.06-2.06l-9.53-13.08c-1.63-2.24-1.14-5.38,1.1-7.01c2.24-1.63,5.38-1.14,7.01,1.1
			l5.18,7.11l19.56-30.9c1.48-2.34,4.58-3.04,6.93-1.56c2.34,1.48,3.04,4.58,1.56,6.93L40.75,64.76c-0.89,1.41-2.42,2.28-4.08,2.33
			C36.62,67.09,36.56,67.09,36.51,67.09z"/>
	</g>
</g>
</svg>
`

    return ico;
}

function crossIcon(color){

    const ico = `
<?xml version="1.0" encoding="utf-8"?>
<svg class="btn-icon" version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 87 87" style="enable-background:new 0 0 87 87;" xml:space="preserve">
<g>
	<path style="fill: ${color}" d="M43.5,7.6c9.6,0,18.6,3.7,25.4,10.5s10.5,15.8,10.5,25.4s-3.7,18.6-10.5,25.4S53.1,79.4,43.5,79.4s-18.6-3.7-25.4-10.5
		S7.6,53.1,7.6,43.5s3.7-18.6,10.5-25.4S33.9,7.6,43.5,7.6 M43.5,0C19.5,0,0,19.5,0,43.5S19.5,87,43.5,87S87,67.5,87,43.5
		S67.5,0,43.5,0L43.5,0z"/>
</g>
<path style="fill: ${color}" d="M53.2,40.5l10.7-10.7c1.7-1.7,2-4.8,0.3-6.6c-1.9-2.1-4.9-2.2-6.9-0.2L46.5,33.8c-1.7,1.7-4.3,1.7-6,0L29.7,23.1
	c-2-2-5-1.9-6.9,0.2c-1.6,1.8-1.4,4.9,0.3,6.6l10.7,10.7c1.7,1.7,1.7,4.3,0,6L23.2,57.2c-1.6,1.6-1.9,4.4-0.6,6.2c1,1.4,2.5,2,3.8,2
	c1.1,0,2.4-0.5,3.3-1.4l10.8-10.8c1.7-1.7,4.3-1.7,6,0L57.3,64c0.9,0.9,2.2,1.4,3.3,1.4c1.1,0,2.4-0.5,3.3-1.4
	c1.9-1.9,1.9-4.8,0-6.7L53.2,46.5C51.5,44.8,51.5,42.2,53.2,40.5z"/>
</svg>
`

    return ico;
}

export class QuestionSet
{
    answers = new Map();
    id = "";
    
    constructor(id: string){
        this.id = id;
    }

    addAnswer(id, questionBtn){
        this.answers.set(id, questionBtn);
    }

    containsId(id){
        return this.answers.has(id);
    }

    validate(){
        const showErrors = !this.hasCorrectAnswer();

        for(const questionBtn of this.answers.values()){
            const isCorrect = isQuestionBtnCorrect(questionBtn);
            if(showErrors && !isCorrect && questionBtn.classList.contains('active')){
                questionBtn.innerHTML += crossIcon('red');
            }
            
            if(showErrors && !isCorrect && questionBtn.hasAttribute('data-correct-answer')){
                questionBtn.innerHTML += vuIcon('red');
            }

            if(isCorrect && questionBtn.classList.contains('active')){
                questionBtn.innerHTML += vuIcon('green');
            }            
            
            questionBtn.disabled = true;
            // console.log("state", isCorrect, questionBtn.innerHTML);
        }
    }

    hasCorrectAnswer(){
        for(const questionBtn of this.answers.values()){
            if(!isQuestionBtnCorrect(questionBtn)){
                return false;
            }
        }

        return true;
    }

    hasAtLeastOneAnswer(){
        for(const questionBtn of this.answers.values()){
            if(questionBtn.classList.contains('active')){
                return true;
            }
        }

        return false;
    }

    setDoneAppearance(){
        for(const questionBtn of this.answers.values()){
            questionBtn.classList.add('quiz-btn-done');
        }
    }
}
