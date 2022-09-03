const mapData = new Map([
    [1, new Map([[0,[]],[1,[]],[2,[]]])],
    [2, new Map([[0,[]],[1,[]],[2,[]]])]
]);

var valueToPlace;
var playerToPlay = 1;
var columnPlayed;

initializeGame();


function initializeGame() {
    $(".btnZone .btn").addClass("disabled");
    intializeBtn(0);
    intializeBtn(1);
    intializeBtn(2);
    $(`.roll-result`).on("click", function() {
        if (this.className.includes("disabled")) return false;
        rollDice();
    })

}

function intializeBtn(nb) {
    $(`.column${nb}`).on("click", function() {
        if (this.className.includes("disabled")) return false;
        placeDice(nb);
    })
}

function rollDice() {
    valueToPlace = Math.floor(Math.random()* 6) +1;
    $(`#roll${playerToPlay} .dice-container`).addClass(`d${valueToPlace}`);
    afterRoll();
}

function afterRoll() {
    $(`.zone${playerToPlay} .column`).each((i, elem) => {
        if (mapData.get(playerToPlay).get(i).length < 3) $(elem).removeClass("disabled");
    });
    $(`#roll${playerToPlay}`).addClass('disabled');
}

function placeDice(column) {
    columnPlayed = column;
    mapData.get(playerToPlay).get(column).push(valueToPlace);
    $('.randomZone .rollResult').innerHTML = '';
    removeOpponnentDice(column, valueToPlace);
    afterPlace();
}

function afterPlace() {
    $(".zone .column").addClass("disabled");
    $(`#roll${playerToPlay} .dice-container`).removeClass(`d${valueToPlace}`);
    updateBoard();
    playerToPlay = reversePlayer(playerToPlay);
    $(`#roll${playerToPlay}`).removeClass('disabled');
}

function calculateTempScore(columnData, prevColumnScore, tileValue) {
    switch (columnData.filter(x => x == tileValue).length) {
        case 0:
            return prevColumnScore + tileValue;
        case 1:
            return prevColumnScore - tileValue + (tileValue * 2 * 2)
        case 2:
            return tileValue * 3 * 3
        default:
            return prevColumnScore;
    }
}

function reversePlayer(playerNb) {
    return playerNb==1?2:1;
}

function removeOpponnentDice(column, value) {
    let index = mapData.get(reversePlayer(playerToPlay)).get(column).indexOf(value);
    while (index !== -1) {
        mapData.get(reversePlayer(playerToPlay)).get(column).splice(index, 1);
        index = mapData.get(reversePlayer(playerToPlay)).get(column).indexOf(value);
    }
}

function updateBoard() {
    mapData.forEach(function (mapPlayer, i) {
        let scorePlayer = 0;
        mapPlayer.forEach(function (columnList, j) {
            let columnScore = 0;
            let columnData = [];
            for (let k = 0; k < 3; k++) {
                let tile = $(`.playGround .zone.zone${i} .column.column${j} .case.case${k}`);
                if (columnList[k] !== undefined) {
                    if (tile.data("value") == undefined || tile.data("value") == '') {
                        appearDice(i, j, k, columnList[k]);
                        tile.data("value", columnList[k]);
                    } else if (tile.data("value") !== columnList[k] || (getDiceColor(i, j, tile.data("value")) && playerToPlay == i && columnPlayed == j)) {
                        disappearDice(i, j, k, tile.data("value"));
                        tile.data("value", columnList[k]);
                        setTimeout(() => {appearDice(i, j, k, columnList[k])}, 200);
                    }
                    columnScore = calculateTempScore(columnData, columnScore, columnList[k]);
                    columnData.push(columnList[k]);
                } else if (tile.data("value") == undefined || tile.data("value") !== '') {
                    disappearDice(i, j, k);
                    tile.data("value", "");
                }
            }
            scorePlayer += columnScore
            $(`.scoreZone${i} .scoreCase${j}`)[0].innerHTML = columnScore;
        })
        $(`.rollPlayer${i} .player-score`)[0].innerHTML = scorePlayer;
    })
}


function appearDice(zone, column, tile, d) {
    $(`.zone${zone} .column${column} .case${tile}`).removeClass().addClass(`case case${tile} d${d} ${getDiceColor(zone, column, d)}`);
    $(`.zone${zone} .column${column} .case${tile} span`).addClass(`d${d}`); 
}

function disappearDice(zone, column, tile, d) {
    $(`.zone${zone} .column${column} .case${tile} span`).removeClass();
}

function getDiceColor(zone, column, d) {
    let columnData = mapData.get(zone).get(column)
    switch (columnData.filter(x => x == d).length) {
        case 1:
            return "";
        case 2:
            return "orange";
        case 3:
            return "blue";
        default:
            return "";
    }
}