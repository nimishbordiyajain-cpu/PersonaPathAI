import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "How do you recharge after a long, busy week?",
    options: [
      { id: "a", text: "Going out with friends or attending a social event", value: "Extrovert" },
      { id: "b", text: "Curling up with a book, movie, or solo hobby", value: "Introvert" },
      { id: "c", text: "Spending time in nature or doing physical activity", value: "Active" },
      { id: "d", text: "Working on a personal passion project", value: "Creative" }
    ]
  },
  {
    id: 2,
    question: "When faced with a complex problem, what's your first instinct?",
    options: [
      { id: "a", text: "Break it down logically and analyze the data", value: "Analytical" },
      { id: "b", text: "Trust my gut feeling and intuition", value: "Intuitive" },
      { id: "c", text: "Ask others for their opinions and collaborate", value: "Collaborative" },
      { id: "d", text: "Look for a creative, out-of-the-box solution", value: "Innovative" }
    ]
  },
  {
    id: 3,
    question: "How do you prefer to organize your daily tasks?",
    options: [
      { id: "a", text: "Strict to-do lists and time-blocking", value: "Structured" },
      { id: "b", text: "Rough goals, but I keep things flexible", value: "Flexible" },
      { id: "c", text: "I prioritize whatever feels most urgent in the moment", value: "Spontaneous" },
      { id: "d", text: "I often multitask and juggle several things at once", value: "Dynamic" }
    ]
  },
  {
    id: 4,
    question: "In a group project, which role do you naturally gravitate towards?",
    options: [
      { id: "a", text: "The Leader: delegating tasks and keeping the vision", value: "Leadership" },
      { id: "b", text: "The Specialist: focusing deeply on one specific part", value: "Technical" },
      { id: "c", text: "The Mediator: ensuring everyone gets along", value: "Diplomatic" },
      { id: "d", text: "The Presenter: pitching the final result", value: "Communication" }
    ]
  },
  {
    id: 5,
    question: "What motivates you most in a career?",
    options: [
      { id: "a", text: "Financial security and clear advancement", value: "Ambitious" },
      { id: "b", text: "Helping others and making a social impact", value: "Altruistic" },
      { id: "c", text: "Creative freedom and self-expression", value: "Artistic" },
      { id: "d", text: "Solving difficult challenges and learning new things", value: "Intellectual" }
    ]
  },
  {
    id: 6,
    question: "How do you handle unexpected changes or surprises?",
    options: [
      { id: "a", text: "I get stressed initially but create a new plan", value: "Planner" },
      { id: "b", text: "I adapt quickly; change is exciting", value: "Adaptable" },
      { id: "c", text: "I analyze the risks before moving forward", value: "Cautious" },
      { id: "d", text: "I look for the hidden opportunity in the chaos", value: "Optimistic" }
    ]
  },
  {
    id: 7,
    question: "When making a decision, what weighs more?",
    options: [
      { id: "a", text: "Objective facts and logic", value: "Thinking" },
      { id: "b", text: "How it affects people and feelings", value: "Feeling" },
      { id: "c", text: "Past experiences and traditions", value: "Traditional" },
      { id: "d", text: "Future possibilities and potential", value: "Visionary" }
    ]
  },
  {
    id: 8,
    question: "Which fictional world would you survive best in?",
    options: [
      { id: "a", text: "A high-tech cyberpunk future", value: "Tech-savvy" },
      { id: "b", text: "A magical fantasy kingdom", value: "Imaginative" },
      { id: "c", text: "A post-apocalyptic survival scenario", value: "Resilient" },
      { id: "d", text: "A high-stakes political drama", value: "Strategic" }
    ]
  }
];
