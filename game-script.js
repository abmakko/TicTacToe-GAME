const gameBoard = () => {
  let gameState = {
    slots: new Array(9).fill(""),
  };

  return player(gameState);
};

player = (gameState) => ({
  fillSlot: (slotPosition, playerTurn) => {
    if (playerTurn == "player1") {
      gameState.slots[slotPosition] = "X";
    } else {
      gameState.slots[slotPosition] = "O";
    }
  },

  getslot: (slotPosition) => gameState.slots[slotPosition],
  checkWin: () => checkWinner(gameState.slots),
  checkFill: (array) => checkFilledArray(array),
  getArray: () => gameState.slots,
  cloneArray: (targetArray) => (gameState.slots = [...targetArray]),
});

const InitVariables = (function () {
  const gamePlay = gameBoard();
  let turnToggle = true;
  let playerTurn = "player1";
  let result = "";
  let maxValue = Infinity;
  let minValue = -Infinity;
  let turnStatus = false;
  let recordedMoves = [];
  let actionsLoop = [];
  let actionStatus = [];
  let terminalStatus = "";
  let simulation_Over = false;

  const slotsArrayDivs = document.querySelectorAll(".slots");
  Array.from(slotsArrayDivs).forEach((element) =>
    element.addEventListener("click", fillPositionControl)
  );
  return {
    gamePlay,
    turnToggle,
    playerTurn,
    result,
    slotsArrayDivs,
    turnStatus,
    maxValue,
    minValue,
    recordedMoves,
    actionsLoop,
    actionStatus,
    terminalStatus,
    simulation_Over,
  };
})();

function fillPositionControl(e) {
  if (InitVariables.turnToggle === true) {
    let slotID = Number(e.target.id);
    InitVariables.playerTurn = "player1";
    InitVariables.gamePlay.fillSlot(slotID, InitVariables.playerTurn);
    InitVariables.gamePlay.checkWin();
    e.target.removeEventListener("click", fillPositionControl);
    e.target.textContent = InitVariables.gamePlay.getslot(slotID);
    InitVariables.turnToggle = false;
    AI_moveDecider(InitVariables.gamePlay);
  } else {
    let slotID = Number(e.target.id);
    InitVariables.playerTurn = "player2";
    InitVariables.gamePlay.fillSlot(slotID, InitVariables.playerTurn);
    InitVariables.gamePlay.checkWin();
    e.target.textContent = InitVariables.gamePlay.getslot(slotID);
    e.target.removeEventListener("click", fillPositionControl);
    InitVariables.turnToggle = true;
  }
  this.classList.add("filled-slot");
}

function checkEqualSlots(slot_1, slot_2, slot_3) {
  if (slot_1 && slot_2 && slot_3 != "") {
    if (slot_1 == slot_2 && slot_2 == slot_3) {
      return slot_1;
    }
  }
}

function disableEmptySlots() {
  Array.from(InitVariables.slotsArrayDivs).forEach((element) => {
    if (element.textContent == "") {
      element.removeEventListener("click", fillPositionControl);
    }
  });
}

function checkFilledArray(array) {
  if (!array.includes("")) {
    console.log("it's a draw/tie");
    InitVariables.result = "tie";
  }
}

function checkWinner(array) {
  const checkerObj = {
    check_1: [array[0], array[1], array[2]],
    check_2: [array[0], array[3], array[6]],
    check_3: [array[0], array[4], array[8]],
    check_4: [array[1], array[4], array[7]],
    check_5: [array[2], array[4], array[6]],
    check_6: [array[2], array[5], array[8]],
    check_7: [array[3], array[4], array[5]],
    check_8: [array[6], array[7], array[8]],
  };

  for (i = 0; i < 8; i++) {
    InitVariables.result = checkEqualSlots(...Object.values(checkerObj)[i]);
    if (InitVariables.result == "X" || InitVariables.result == "O") {
      console.log(`winner is ${InitVariables.result}`);
      console.log(Object.keys(checkerObj)[i]);
      if (InitVariables.simulation_Over == true) {
        disableEmptySlots();
      }
      return InitVariables.result;
    }
  }

  if (InitVariables.result == undefined) {
    InitVariables.gamePlay.checkFill(array);
  }
}

// ToDo: MAKE A COMPUTER A.I PLAYER

function TerminalWinState(array) {
  let tempResult = checkWinner(array);
  if (tempResult == "X") {
    return 1;
  } else if (InitVariables.result == "tie") {
    return 0;
  } else if (tempResult == "O") {
    return -1;
  }
}

function playableActions(array) {
  let indexArray = [];
  for (i = 0; i < array.length; i++) {
    if (array[i] == "") {
      indexArray.push(i);
    }
  }
  return indexArray;
}

function simulateResult(gameState, playAction) {
  let gameBoardClone = gameBoard();
  const tempArray = gameState.getArray(); //using object properties
  //you can set a condition to achieve a less expensive clone when simulation object has been previously initiated.
  gameBoardClone.cloneArray(tempArray);
  if (InitVariables.turnStatus == false) {
    gameBoardClone.fillSlot(playAction, "player2");
    InitVariables.recordedMoves.push(playAction);
  } else {
    gameBoardClone.fillSlot(playAction, "player1");
  }

  InitVariables.turnStatus = InitVariables.turnStatus ? false : true;

  return gameBoardClone;
}

function AI_moveDecider(gameState) {
  let endResults = [];
  //we need to make a deep copy of possible play actions at first function call
  InitVariables.actionsLoop = [...playableActions(gameState.getArray())];

  //each branch action is acting as a node of possible new state actions
  //feed actions to player moves based on nested for loop calculations from here.
  for (branching_Action in InitVariables.actionsLoop) {
    InitVariables.simulation_Over = false;
    InitVariables.turnStatus = false;
    let status = AI_search(
      gameState,
      InitVariables.actionsLoop[branching_Action]
    );
    endResults.push(status);
    //some calulations for index determinant of second looper
    for (i = 0; i < InitVariables.actionsLoop.length - 1; i++) {
      //calcultate playeable actions here by doing some substractions and splicing things.
      console.log(
        "This is player first move - brancher",
        InitVariables.actionsLoop[i],
        branching_Action
      );
      //newarray = parent looper - first parent child loopidyloop
      //you can use recorded moves instead of a loppidyloop.
      //access even number indexes as a determinant of second loop
    }
  }
  InitVariables.simulation_Over = true;
  console.log([...endResults]);

  if (endResults.includes(-1)) {
  } else if (endResults.includes(0)) {
  }
}

function AI_search(gameState, branchedAction) {
  //we need to get the terminal win status as a decider
  InitVariables.terminalStatus = TerminalWinState(gameState.getArray());
  InitVariables.actionStatus = playableActions(gameState.getArray());

  //we need to shuffle the playactions array based on only the newly called branch action,
  if (arguments.length == 2) {
    let tempIndex = InitVariables.actionStatus.indexOf(branchedAction);
    let shuffleVar = branchedAction;
    InitVariables.actionStatus.splice(tempIndex, 1);
    InitVariables.actionStatus.unshift(shuffleVar);
  }

  if (InitVariables.terminalStatus === -1) {
    console.log(InitVariables.terminalStatus);
    console.log("exiting recursion... winning path found");
    console.log("actions...", InitVariables.recordedMoves);
    console.log(gameState.getArray());
    InitVariables.simulation_Over = true;
    recordedMoves_copy = [...InitVariables.recordedMoves];
    InitVariables.recordedMoves = [];
    return InitVariables.terminalStatus;
  } else if (InitVariables.terminalStatus === 0) {
    InitVariables.simulation_Over = true;
    console.log(InitVariables.terminalStatus);
    console.log("exiting recursion... drawtie path found");
    console.log("actions...", InitVariables.recordedMoves);
    recordedMoves_copy = [...InitVariables.recordedMoves];
    InitVariables.recordedMoves = [];
    console.log(gameState.getArray());
    return InitVariables.terminalStatus;
  } else if (InitVariables.terminalStatus === 1) {
    InitVariables.simulation_Over = true;
    console.log(InitVariables.terminalStatus);
    console.log("exiting recursion...");

    console.log(...InitVariables.recordedMoves);
    InitVariables.recordedMoves = [];
    return InitVariables.terminalStatus;
  }

  if (
    InitVariables.turnStatus == false &&
    InitVariables.simulation_Over == false
  ) {
    if (InitVariables.actionStatus.length > 0) {
      for (a in InitVariables.actionStatus) {
        if (
          InitVariables.terminalStatus === -1 ||
          InitVariables.terminalStatus === 0 ||
          InitVariables.terminalStatus === 1
        ) {
          break;
        }
        InitVariables.maxValue = Math.min(
          InitVariables.maxValue,
          AI_search(simulateResult(gameState, InitVariables.actionStatus[a]))
        );
      }

      return InitVariables.terminalStatus;
    } else console.log("moves exhausted");
  }

  if (
    InitVariables.turnStatus == true &&
    InitVariables.simulation_Over == false
  ) {
    if (InitVariables.actionStatus.length > 0) {
      for (a in InitVariables.actionStatus) {
        if (
          InitVariables.terminalStatus === -1 ||
          InitVariables.terminalStatus === 0 ||
          InitVariables.terminalStatus === 1
        ) {
          break;
        }
        InitVariables.minValue = Math.max(
          InitVariables.minValue,
          AI_search(simulateResult(gameState, InitVariables.actionStatus[a]))
        );
      }

      return InitVariables.terminalStatus;
    }
  } else console.log("moves exhausted");
}
