import { Question } from "@/structures/interfaceFile";

export type Test = {
  [subjectName: string]: Question[];
};

export const Test_One = {
  English: [
    {
      Q: "What time do you usually wake up in the morning?",
      A: "I usually wake up around 6:30 in the morning to get ready for school.",
    },
    {
      Q: "How do you spend your weekends?",
      A: "I usually spend my weekends relaxing, doing homework, or meeting friends.",
    },
    {
      Q: "What do you like to eat for breakfast?",
      A: "I like to eat bread and eggs for breakfast because it gives me energy.",
    },
    {
      Q: "Do you prefer reading books or watching movies?",
      A: "I prefer watching movies because they are more entertaining and visual.",
    },
    {
      Q: "How do you help your parents at home?",
      A: "I help my parents by cleaning my room and setting the dining table.",
    },
    {
      Q: "What do you like most about your school?",
      A: "I like my teachers and friends because they make learning enjoyable.",
    },
    {
      Q: "What is your favorite subject and why?",
      A: "My favorite subject is English because I enjoy reading and writing stories.",
    },
    {
      Q: "How do you travel to school every day?",
      A: "I usually travel to school by bus with my friends.",
    },
    {
      Q: "What do you do before going to bed?",
      A: "Before going to bed, I read a book or listen to some music.",
    },
    {
      Q: "What kind of music do you like?",
      A: "I like pop music because it is lively and fun to listen to.",
    },
  ],
};

export const Test_Two = {
  English: [
    {
      Q: "Who is your best friend and why?",
      A: "My best friend is Riya because she is kind and always supports me.",
    },
    {
      Q: "What do you and your friends like to do together?",
      A: "We like to play games, talk about school, and sometimes study together.",
    },
    {
      Q: "How do you spend time with your family?",
      A: "I spend time with my family by watching movies or having dinner together.",
    },
    {
      Q: "Who do you talk to when you feel sad?",
      A: "I usually talk to my mother when I feel sad because she always understands me.",
    },
    {
      Q: "What do you like most about your parents?",
      A: "I like that my parents always encourage me to do my best.",
    },
    {
      Q: "Do you have any siblings? Describe them.",
      A: "Yes, I have a younger brother who is very playful and funny.",
    },
    {
      Q: "What is a fun memory you have with your family?",
      A: "Last summer, we went to the beach and built sandcastles together. It was so much fun!",
    },
    {
      Q: "How do you celebrate birthdays in your family?",
      A: "We celebrate birthdays by cutting a cake, decorating the house, and inviting friends.",
    },
    {
      Q: "Who inspires you the most in your family?",
      A: "My father inspires me because he works hard and never gives up.",
    },
    {
      Q: "What is your favorite family tradition?",
      A: "My favorite tradition is having dinner together every Sunday evening.",
    },
  ],
};

export const Test_Three = {
  Chemistry: [
    {
      Q: "What is chemistry?",
      A: "Chemistry is the branch of science that studies matter, its composition, structure, properties, and the changes it undergoes.",
    },
    {
      Q: "What is an atom?",
      A: "An atom is the smallest unit of an element that retains its chemical properties.",
    },
    {
      Q: "What is a molecule?",
      A: "A molecule is formed when two or more atoms combine chemically and act as a single unit.",
    },
    {
      Q: "What is the difference between an element and a compound?",
      A: "An element contains only one type of atom, while a compound is made up of two or more different elements chemically bonded together.",
    },
    {
      Q: "What is the Law of Conservation of Mass?",
      A: "It states that mass can neither be created nor destroyed during a chemical reaction; the mass of reactants equals the mass of products.",
    },
    {
      Q: "What is the periodic table?",
      A: "The periodic table organizes elements based on their atomic number, electron configuration, and recurring chemical properties.",
    },
    {
      Q: "What are physical and chemical changes?",
      A: "A physical change alters the appearance but not the composition of a substance, while a chemical change forms new substances with different properties.",
    },
    {
      Q: "What is an ion?",
      A: "An ion is an atom or molecule that has gained or lost electrons, giving it a positive or negative charge.",
    },
    {
      Q: "What is a catalyst?",
      A: "A catalyst is a substance that speeds up a chemical reaction without being consumed in the process.",
    },
    {
      Q: "What are acids and bases?",
      A: "Acids are substances that produce hydrogen ions (H⁺) in solution, while bases produce hydroxide ions (OH⁻).",
    },
  ],
};

export const Test_Four = {
  Biology: [
    {
      Q: "What is biology?",
      A: "Biology is the branch of science that studies living organisms, their structure, function, growth, and interactions with the environment.",
    },
    {
      Q: "What is a cell?",
      A: "A cell is the basic structural and functional unit of life found in all living organisms.",
    },
    {
      Q: "What are the two main types of cells?",
      A: "The two main types are prokaryotic cells, which lack a nucleus, and eukaryotic cells, which have a well-defined nucleus.",
    },
    {
      Q: "What is photosynthesis?",
      A: "Photosynthesis is the process by which green plants make food using sunlight, carbon dioxide, and water.",
    },
    {
      Q: "What is the function of the nucleus in a cell?",
      A: "The nucleus controls all activities of the cell and contains the genetic material (DNA).",
    },
    {
      Q: "What is the difference between plant and animal cells?",
      A: "Plant cells have a cell wall, chloroplasts, and a large vacuole, while animal cells do not.",
    },
    {
      Q: "What is respiration?",
      A: "Respiration is the process by which living organisms release energy from food molecules like glucose.",
    },
    {
      Q: "What are tissues?",
      A: "Tissues are groups of similar cells that work together to perform a specific function.",
    },
    {
      Q: "What is DNA?",
      A: "DNA (Deoxyribonucleic Acid) carries genetic information that determines an organism’s traits and controls cell functions.",
    },
    {
      Q: "What is an ecosystem?",
      A: "An ecosystem is a community of living organisms interacting with each other and with their non-living environment.",
    },
  ],
};

export const Test_Seven = {
  Geography: [
    {
      Q: "What are the main components of the Earth's atmosphere?",
      A: "The main components are nitrogen, oxygen, argon, carbon dioxide, and trace gases.",
    },
    {
      Q: "What causes the change of seasons on Earth?",
      A: "The tilt of the Earth's axis and its revolution around the Sun cause the change of seasons.",
    },
    {
      Q: "What is the difference between weather and climate?",
      A: "Weather refers to short-term atmospheric conditions, while climate is the average weather over a long period.",
    },
    {
      Q: "Name the layers of the Earth.",
      A: "The Earth has three main layers: crust, mantle, and core.",
    },
    {
      Q: "What are tectonic plates?",
      A: "Tectonic plates are large pieces of the Earth's crust that move slowly over the mantle.",
    },
    {
      Q: "What is the water cycle?",
      A: "The water cycle describes how water evaporates, condenses into clouds, and returns to the Earth as precipitation.",
    },
    {
      Q: "What are renewable and non-renewable resources?",
      A: "Renewable resources can be replaced naturally, like solar and wind energy; non-renewable resources like coal and oil cannot be replaced quickly.",
    },
    {
      Q: "What is soil erosion and how can it be prevented?",
      A: "Soil erosion is the removal of topsoil by wind or water. It can be prevented by planting trees and using contour plowing.",
    },
    {
      Q: "Name some major landforms on Earth.",
      A: "Major landforms include mountains, plateaus, plains, valleys, and deserts.",
    },
    {
      Q: "Why is sustainable development important?",
      A: "Sustainable development ensures that natural resources are used responsibly so future generations can meet their needs.",
    },
  ],
};

export const Test_Eight = {
  History: [
    {
      Q: "When did World War I begin and end?",
      A: "World War I began in 1914 and ended in 1918.",
    },
    {
      Q: "What event triggered World War I?",
      A: "The assassination of Archduke Franz Ferdinand of Austria-Hungary in 1914.",
    },
    {
      Q: "When did World War II begin and end?",
      A: "World War II began in 1939 and ended in 1945.",
    },
    {
      Q: "What event marked the beginning of World War II?",
      A: "Germany’s invasion of Poland in 1939.",
    },
    {
      Q: "What was the Cold War?",
      A: "A period of political and military tension between the United States and the Soviet Union from 1947 to 1991.",
    },
    {
      Q: "What was the Iron Curtain?",
      A: "A term describing the division between communist Eastern Europe and democratic Western Europe during the Cold War.",
    },
    {
      Q: "What was D-Day in World War II?",
      A: "The Allied invasion of Normandy, France, on June 6, 1944, to liberate Western Europe from Nazi control.",
    },
    {
      Q: "What caused Japan to surrender in World War II?",
      A: "The atomic bombings of Hiroshima and Nagasaki in August 1945.",
    },
    {
      Q: "What was the main ideological conflict during the Cold War?",
      A: "The struggle between capitalism (led by the U.S.) and communism (led by the Soviet Union).",
    },
    {
      Q: "When did the Cold War end?",
      A: "The Cold War ended in 1991 with the collapse of the Soviet Union.",
    },
  ],
};

export const Test_Nine = {
  Physics: [
    {
      Q: "What is kinematics?",
      A: "Kinematics is the study of motion without considering the forces that cause it.",
    },
    {
      Q: "What is the difference between speed and velocity?",
      A: "Speed is how fast an object moves, while velocity includes both speed and direction.",
    },
    {
      Q: "What is acceleration?",
      A: "Acceleration is the rate of change of velocity over time.",
    },
    {
      Q: "What is displacement?",
      A: "Displacement is the shortest straight-line distance between an object’s starting and ending points.",
    },
    {
      Q: "What does a distance-time graph represent?",
      A: "It shows how the distance covered by an object changes with time.",
    },
    {
      Q: "What does the slope of a velocity-time graph represent?",
      A: "The slope represents the acceleration of the object.",
    },
    {
      Q: "What is uniform motion?",
      A: "Uniform motion occurs when an object moves at a constant speed in a straight line.",
    },
    {
      Q: "What is non-uniform motion?",
      A: "Non-uniform motion occurs when an object’s speed or direction changes over time.",
    },
    {
      Q: "What is meant by instantaneous velocity?",
      A: "It is the velocity of an object at a specific moment in time.",
    },
    {
      Q: "Can an object have zero displacement but non-zero distance?",
      A: "Yes, if it returns to its starting point after moving, its displacement is zero but distance is not.",
    },
  ],
};

export const Test_Ten = {
  Science: [
    {
      Q: "What is matter?",
      A: "Matter is anything that has mass and occupies space.",
    },
    {
      Q: "What is an atom?",
      A: "An atom is the smallest unit of an element that retains its chemical properties.",
    },
    {
      Q: "What is the difference between a solid, liquid, and gas?",
      A: "Solids have a fixed shape and volume, liquids have a fixed volume but no fixed shape, and gases have neither.",
    },
    {
      Q: "What is photosynthesis?",
      A: "The process by which green plants make food using sunlight, carbon dioxide, and water.",
    },
    {
      Q: "What is respiration?",
      A: "The process by which living organisms release energy from food.",
    },
    {
      Q: "What is the function of DNA?",
      A: "DNA carries genetic information that determines an organism’s traits.",
    },
    {
      Q: "What is the difference between physical and chemical changes?",
      A: "Physical changes alter form but not composition, while chemical changes produce new substances.",
    },
    {
      Q: "What are renewable and non-renewable resources?",
      A: "Renewable resources replenish naturally, while non-renewable ones like coal and oil do not.",
    },
    {
      Q: "What is an ecosystem?",
      A: "A community of living organisms interacting with their non-living environment.",
    },
    {
      Q: "What is a cell?",
      A: "A cell is the basic structural and functional unit of life.",
    },
  ],
};

export type TestsType = {
  [subjectName: string]: Test;
};

export const Tests: TestsType = {
  "English I": Test_One,
  "English II": Test_Two,
  Geography: Test_Seven,
  History: Test_Eight,
  Physics: Test_Nine,
  Chemistry: Test_Three,
  Biology: Test_Four,
  Science: Test_Ten,
};

const scoreMessages: Record<number, string[]> = {
  0: [
    "Don't be discouraged — this is just the beginning!",
    "Everyone starts somewhere — keep practicing!",
    "Take this as a learning opportunity.",
    "Mistakes are a step toward improvement.",
    "Stay motivated! Next attempt will be better.",
    "It's okay to struggle — you'll improve!",
    "Keep trying — every effort counts!",
    "Learning takes time, don't give up!",
    "Remember: failure is the first step to success.",
    "Use this as a guide to focus on weak areas.",
  ],
  1: [
    "Don't worry, keep practicing and you'll improve!",
    "Everyone starts somewhere — keep trying!",
    "It's a tough start, but you can do better next time!",
    "Learning takes time — don't give up!",
    "Keep working at it, progress comes step by step!",
    "Not your best, but every mistake is a lesson!",
    "Challenge accepted — next time will be better!",
    "Stay motivated! Improvement is on the way.",
    "Take this as a starting point to grow!",
    "Keep your head up — practice makes perfect!",
  ],
  2: [
    "A bit better, but there's room for improvement!",
    "You're making progress, keep going!",
    "Mistakes happen, learn from them!",
    "Keep practicing to boost your score!",
    "Small steps lead to big improvements!",
    "Don't lose heart — improvement is coming!",
    "Stay focused, you can do better next time!",
    "Every attempt teaches you something new!",
    "Keep trying, your effort counts!",
    "Work on weak areas, you'll get there!",
  ],
  3: [
    "You're getting there, keep improving!",
    "Some progress! Focus on your weak points.",
    "You're learning — don't stop now!",
    "Room for improvement, but good effort!",
    "Keep practicing, you'll get better!",
    "Not bad, but aim higher next time!",
    "Every mistake is a learning opportunity.",
    "Keep going, improvement is coming!",
    "You're on the right track, stay focused!",
    "Good effort! Keep building on it.",
  ],
  4: [
    "Decent effort! Keep pushing forward.",
    "You're improving — don't stop now!",
    "Some correct answers, room to grow.",
    "Keep practicing, you're getting better!",
    "Not perfect, but good attempt!",
    "Learning is happening, keep it up!",
    "You're making progress, focus more!",
    "Steady progress! Aim for higher scores.",
    "You’re on your way, keep practicing!",
    "Good attempt! Keep striving for better.",
  ],
  5: [
    "Halfway there! Nice effort.",
    "Good job, but room for improvement.",
    "You're making progress — keep practicing.",
    "Solid effort, aim for even better next time!",
    "You're improving, stay consistent.",
    "Not bad, keep refining your answers!",
    "Nice work! Focus on weak areas to improve.",
    "You're doing well — push a bit further.",
    "Keep practicing, you can get higher!",
    "Good attempt! Keep aiming higher.",
  ],
  6: [
    "Good work! You're getting stronger.",
    "Well done! Minor improvements can make a difference.",
    "Nice effort, keep refining your skills.",
    "You're improving steadily, keep going!",
    "Solid performance, aim a little higher next time.",
    "Great attempt! Keep practicing for perfection.",
    "You're on the right track — keep it up!",
    "Good score! Keep pushing for excellence.",
    "Nice work! Focus on small details to improve.",
    "You're doing well — keep going!",
  ],
  7: [
    "Great job! You're doing really well.",
    "Well done! Only minor tweaks needed.",
    "You're strong in many areas — keep going!",
    "Nice effort! Keep refining your knowledge.",
    "Good work! Almost at the top.",
    "You're improving consistently — great job!",
    "Impressive work! Keep it up.",
    "Good performance — aim for perfection next time.",
    "You're doing really well, stay focused!",
    "Keep it up! You're very close to full marks.",
  ],
  8: [
    "Excellent work! Very well done.",
    "Great score! Minor improvements only.",
    "You're strong in most areas — excellent job!",
    "Amazing effort! Keep refining for perfection.",
    "Well done! Almost perfect.",
    "Impressive performance! Just a few tweaks needed.",
    "You're doing great — keep up the consistency!",
    "Excellent! Keep practicing to stay sharp.",
    "Very good work! Focus on small details to reach 10/10.",
    "Awesome! You're doing really well.",
  ],
  9: [
    "Outstanding! So close to perfection!",
    "Fantastic job! Only minor adjustments needed.",
    "Excellent work! You're nearly perfect.",
    "Impressive! Keep up the high standard.",
    "Great effort! Just a tiny bit away from full marks.",
    "Superb! You’re almost at the top.",
    "Amazing performance! One more step to perfection.",
    "Well done! Very few errors remain.",
    "Excellent! Keep maintaining this level.",
    "You're doing amazing! Almost perfect.",
  ],
  10: [
    "Excellent! Perfect score!",
    "Outstanding! You nailed it!",
    "Brilliant work — keep it up!",
    "Amazing! You aced the test!",
    "Fantastic! Full marks achieved!",
    "Perfect performance! Well done!",
    "You're a star! 10/10!",
    "Impressive! You got everything right!",
    "Exceptional! Keep up the great work!",
    "Top-notch! You’ve mastered it!",
  ],
};

// Function to normalize score and pick a random message
export function getRandomScoreMessageFromTotal(
  score: number,
  totalMarks: number
) {
  if (score == 0)
    return "You have not provided any answers yet. Please attempt the questions to receive a score.";
  if (totalMarks <= 0)
    return "Your score is 0. Review the material and try again to improve your performance.";

  // Step 1: Convert to 0-10 scale
  const normalized = (score / totalMarks) * 10;

  // Step 2: Round to nearest integer
  const roundedScore = Math.round(normalized);

  // Step 3: Clamp between 0 and 10
  const finalScore = Math.max(0, Math.min(10, roundedScore));

  // Step 4: Pick random message for the final score
  const messages = scoreMessages[finalScore];
  if (!messages || messages.length === 0) return "Good effort!";
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

// Assign color per correction type
export const typeToColor: Record<string, string> = {
  grammar: "bg-yellow-200",
  punctuation: "bg-blue-200",
  spelling: "bg-red-200",
  capitalization: "bg-pink-200",
  preposition: "bg-orange-200",
  "missing-words": "bg-purple-200",
  default: "bg-green-200",
};
