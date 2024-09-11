/** Define types for choices and outcomes */
type Choice = 'ROCK' | 'PAPER' | 'SCISSORS';
type Outcome = 'WIN' | 'DRAW' | 'LOSS';

/** Some related "constants" which represent the various outcomes a round can have. */
export const OUTCOME_WIN = "WIN";
export const OUTCOME_DRAW = "DRAW";
export const OUTCOME_LOSS = "LOSS";

/** Some related "constants" which represent the possible choices a player can make when playing. */
export const CHOICE_ROCK = "ROCK";
export const CHOICE_PAPER = "PAPER";
export const CHOICE_SCISSORS = "SCISSORS";

/** Should return a randomly selected choice. Either: "ROCK", "PAPER", "SCISSORS" */
export function getRandomComputerMove() {
  const choice = Math.trunc(Math.random() * 3);
  switch (choice) {
    case 0:
      return CHOICE_ROCK;
    case 1:
      return CHOICE_PAPER;
    case 2:
      return CHOICE_SCISSORS;
    default:
      throw new Error(`Unsupported choice: ${choice}`);
  }
}

/**
 * Should return either: "ROCK", "PAPER", "SCISSORS" (or null if the user cancelled)
 */
export function getPlayerMove(): Choice | null  {
  while (true) {
    const rawInput = prompt("Enter a move: rock/paper/scissors");
    const userHasCancelled = null === rawInput;

    if (userHasCancelled) {
      return null;
    }

    switch (rawInput.toLowerCase()) {
      case "r":
      case "rock":
        return CHOICE_ROCK;
      case "p":
      case "paper":
        return CHOICE_PAPER;
      case "s":
      case "scissors":
        return CHOICE_SCISSORS;
    }
  }
}

/** Should return an outcome. Either "WIN", "LOSS" or "DRAW" */
export function getOutcomeForRound(playerChoice: Choice, computerChoice: Choice): Outcome {
  const playerHasDrawn = playerChoice === computerChoice;

  if (playerHasDrawn) {
    return OUTCOME_DRAW;
  }

  const playerHasWon =
    (playerChoice === CHOICE_PAPER && computerChoice === CHOICE_ROCK) ||
    (playerChoice === CHOICE_SCISSORS && computerChoice === CHOICE_PAPER) ||
    (playerChoice === CHOICE_ROCK && computerChoice === CHOICE_SCISSORS);

  if (playerHasWon) {
    return OUTCOME_WIN;
  }

  return OUTCOME_LOSS;
}

/** Define types for round results and game model */
interface RoundResult {
  playerMove: Choice;
  computerMove: Choice;
  outcome: Outcome;
}

interface GameModel {
  playerScore: number;
  computerScore: number;
}


/** Should return an object containing information about the played round. */
export function playOneRound(): RoundResult | null {
  const playerMove = getPlayerMove();
  if (playerMove === null) {
    return null;
  }

  const computerMove = getRandomComputerMove();
  const outcome = getOutcomeForRound(playerMove, computerMove);

  return {
    playerMove,
    computerMove,
    outcome,
  };
}

/** Should return undefined/void if the loop were to stop. */
export function playGame() {
  /** Some basic game state, where things like scores are tracked. */
  let model = {
    playerScore: 0,
    computerScore: 0,
  };

  while (true) {
    const dataForRound = playOneRound();

    if (null === dataForRound) {
      break;
    }

    model = updateModel(model, dataForRound);
    showProgressInConsole(dataForRound, model);
  }
}

/** Function to update game model based on the round outcome */
export function updateModel(model: GameModel, dataForRound: RoundResult): GameModel {
  switch (dataForRound.outcome) {
    case OUTCOME_WIN:
      return { ...model, playerScore: model.playerScore + 1 };
    case OUTCOME_LOSS:
      return { ...model, computerScore: model.computerScore + 1 };
    default:
      return model;
  }
}

/** Function to display the current game progress in the console */
export function showProgressInConsole(dataForRound: RoundResult, model: GameModel): void {
  console.table([
    {
      'Your choice': dataForRound.playerMove,
      'Computer choice': dataForRound.computerMove,
      Outcome: dataForRound.outcome,
      'Your score': model.playerScore,
      'Computer score': model.computerScore,
    },
  ]);
}

playGame();
