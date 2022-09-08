"use strict";

const data = [
	{
		question: "Укажите свой пол:",
		type: "duo",
		answers: ["Женщина", "Мужчина"]
	},
	{
		question: "В какое время суток Вы чувствуете себя наиболее комфортно?",
		type: "default",
		answers: ["Утро", "Ночь ", "Вечер", "День"]
	},
	{
		question: "Подскажите, мучает ли Вас бессонница последнее время?",
		type: "default",
		answers: ["Да", "Нет", "Иногда"]
	},
	{
		question: "Чувствуете ли Вы в последнее время, что вам никак не удается осуществить ваши планы?",
		type: "default",
		answers: ["Да", "Нет", "Иногда"]
	},
	{
		question: "Какой Вы видите свою жизнь через 5 лет?",
		type: "default",
		answers: ["Брак, семья, дети, дом", "Путешествия по Миру", "Успешная карьера", "Всё вместе"]
	},
	{
		question: "Введите дату своего рождения:",
		type: "date-select",
		answers: [{ day: "День" }, { month: "Месяц" }, { year: "Год" }]
	}
];

let step = 0;

class Question {
	constructor(question, type, answers) {
		this.question = question;
		this.type = type;
		this.answers = answers;
	}

	renderAnswers = () => {
		let questionsInnerHTML = "";

		if (this.type === "duo" || this.type === "default") {
			this.answers.forEach((answear, i) => {
				questionsInnerHTML += `
                <li class="answear">
                    <input type="radio" name="answear" id="radio-${i}">
                    <label for="radio-${i}">${answear}</label>
                </li>
                `;
			});
		} else {
			const options = {
				day: [],
				month: [],
				year: []
			};

			for (let i = 1; i <= 31; i++) {
				let dateUnit = i < 10 ? "0" + i : i;
				options.day.push(`<option value="${i}" >${dateUnit}</option>`);
			}
			for (let i = 1; i <= 12; i++) {
				let dateUnit = i < 10 ? "0" + i : i;
				options.month.push(`<option value="${i}" >${dateUnit}</option>`);
			}
			for (let i = 2022; i >= 1950; i--) {
				let dateUnit = i < 10 ? "0" + i : i;
				options.year.push(`<option value="${i}" >${dateUnit}</option>`);
			}

			//Select options generating depends from date[6].answers key name

			this.answers.forEach((answear) => {
				questionsInnerHTML += `
                <li class="answear">
                    <select name="${Object.keys(answear)}" id="select-${Object.keys(answear)}">
                        <option selected value="${Object.keys(answear)}">${answear[Object.keys(answear)]}</option>
                        ${options[Object.keys(answear)]}
                    </select>
                </li>
                `;
			});
		}

		return questionsInnerHTML;
	};

	render() {
		// Cheking arguments types
		if (typeof this.question !== "string" || typeof this.type !== "string" || !Array.isArray(this.answers)) {
			throw new Error(`Incorrect type of class arguments, must be:
             question: STRING, type: STRING, answers: ARRAY`);
		}

		const quizPromo = document.querySelector(".quiz__promo"),
			progressBar = document.querySelector(".quiz__progress-bar"),
			progressBarProgress = document.querySelector(".quiz__progress-bar-progress");

		//Rendering question-block
		const question = document.createElement("div");

		switch (this.type) {
			case "duo":
				question.className = "question duo-question";
				break;
			case "default":
				question.className = "question radio-question";
				break;
			case "date-select":
				question.className = "question date-select";
				break;
		}

		question.innerHTML = `
            <div class="question__head">${this.question}</div>
                <ul class="question__body">
                    ${this.renderAnswers()}
                    <li class="zodiac">
                        <img src="" alt="">
                        <p class="zodiac__name">Водолей</p>
                    </li>
                </ul>
               
            <button class="question-btn">Далее</button>`;

		document.querySelector(".quiz__content .container").append(question);

		// Adding event to question-block elements
		document.querySelectorAll("input").forEach((input) => {
			input.addEventListener("change", function () {
				document.querySelector(".question-btn").style.display = "block";
			});
		});

		const nextQuestion = () => {
			step += 1;
			genereteCurrentStepQuestion();

			// Changing progress bar value
			progressBarProgress.style.width = (step / data.length) * 100 + "%";

			// Hiding promo screen
			if (document.querySelector(".quiz__promo")) {
				quizPromo.remove();
				progressBar.style.display = "block";
			}
		};

		if (this.type === "duo" || this.type === "default") {
			document.querySelector("button").addEventListener("click", nextQuestion);
		} else {
			let day = document.querySelector("#select-day");
			let month = document.querySelector("#select-month");
			let year = document.querySelector("#select-year");

			document.querySelectorAll("select").forEach((select) => {
				select.addEventListener("change", function () {
					document.querySelector(".question-btn").style.display = "block";
					if (day.value !== "day" && month.value !== "month" && year.value !== "year") {
						let zodiacSignSrc = "",
							zodiacSignName = "";

						if ((+month.value === 3 && +day.value >= 21) || (+month.value === 4 && day.value <= 20)) {
							zodiacSignSrc = "Aries";
						} else if ((+month.value === 4 && +day.value >= 21) || (+month.value === 5 && day.value <= 21)) {
							zodiacSignSrc = "Taurus";
						} else if ((+month.value === 5 && +day.value >= 22) || (+month.value === 6 && day.value <= 21)) {
							zodiacSignSrc = "Gemini";
						} else if ((+month.value === 6 && +day.value >= 22) || (+month.value === 7 && day.value <= 22)) {
							zodiacSignSrc = "Cancer";
						} else if ((+month.value === 7 && +day.value >= 23) || (+month.value === 8 && day.value <= 21)) {
							zodiacSignSrc = "Lion";
						} else if ((+month.value === 8 && +day.value >= 22) || (+month.value === 9 && day.value <= 23)) {
							zodiacSignSrc = "Virgo";
						} else if ((+month.value === 9 && +day.value >= 24) || (+month.value === 10 && day.value <= 23)) {
							zodiacSignSrc = "Libra";
						} else if ((+month.value === 10 && +day.value >= 24) || (+month.value === 11 && day.value <= 22)) {
							zodiacSignSrc = "Scorpio";
						} else if ((+month.value === 11 && +day.value >= 23) || (+month.value === 12 && day.value <= 22)) {
							zodiacSignSrc = "Sagittarius";
						} else if ((+month.value === 12 && +day.value >= 23) || (+month.value === 1 && day.value <= 20)) {
							zodiacSignSrc = "Capricorn";
						} else if ((+month.value === 1 && +day.value >= 21) || (+month.value === 2 && day.value <= 19)) {
							zodiacSignSrc = "Aquarius";
						} else if ((+month.value === 2 && +day.value >= 20) || (+month.value === 3 && day.value <= 20)) {
							zodiacSignSrc = "Pisces";
						}

						switch (zodiacSignSrc) {
							case "Aries":
								zodiacSignName = "Овен";
								break;
							case "Taurus":
								zodiacSignName = "Телец";
								break;
							case "Gemini":
								zodiacSignName = "Близнецы";
								break;
							case "Cancer":
								zodiacSignName = "Рак";
								break;
							case "Lion":
								zodiacSignName = "Лев";
								break;
							case "Virgo":
								zodiacSignName = "Дева";
								break;
							case "Libra":
								zodiacSignName = "Весы";
								break;
							case "Scorpio":
								zodiacSignName = "Скорпион";
								break;
							case "Sagittarius":
								zodiacSignName = "Стрелец";
								break;
							case "Capricorn":
								zodiacSignName = "Козерог";
								break;
							case "Aquarius":
								zodiacSignName = "Водолей";
								break;
							case "Pisces":
								zodiacSignName = "Рыбы";
								break;
						}

						document.querySelector(".zodiac img").setAttribute("src", `../img/zodiac-icons/${zodiacSignSrc}.png`);
						document.querySelector(".zodiac .zodiac__name").textContent = zodiacSignName;

						day.style = `color: var(--prime-blue); font-weight: bold;`;
						month.style = `color: var(--prime-blue); font-weight: bold;`;
						year.style = `color: var(--prime-blue); font-weight: bold;`;

						document.querySelector(".date-select .zodiac").style.display = "block";
					} else {
						day.style = `color: #000; font-weight: normal;`;
						month.style = `color: #000; font-weight: normal;`;
						year.style = `color: #000; font-weight: normal;`;

						document.querySelector(".date-select .zodiac").style.display = "none";
					}
				});
			});

			document.querySelector("button").addEventListener("click", () => {
				if (day.value !== "day" && month.value !== "month" && year.value !== "year") {
					nextQuestion();
				} else {
					const btn = document.querySelector(".question-btn");
					btn.classList.toggle("question-btn--invalid");
					btn.textContent = "Пожалуйста, выберите ответ";

					setTimeout(() => {
						btn.classList.toggle("question-btn--invalid");
						btn.textContent = "Далее";
					}, 2000);
				}
			});
		}
	}
}

function genereteCurrentStepQuestion() {
	if (document.querySelector(".question")) document.querySelector(".question").remove();

	if (step !== data.length) {
		new Question(...Object.values(data[step])).render(); // spreading the data values as an arguments
	}
}

genereteCurrentStepQuestion();
