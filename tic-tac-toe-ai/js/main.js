
let blockstates = [0,0,0,0,0,0,0,0,0]
let chance = 1;
let ai = 2;

function make_grid(){
    let board = document.getElementById("grid");
    let htmlcode = "";
    for(let i=0; i< 9 ; i++){
        let blockid = 'block'+i;
        let blockidbtn = 'block'+i+'-btn';
        htmlcode+=`<div id='${blockid}' class='block'><button class='block-btn' id='${blockidbtn}' onclick='make_move("${blockid}")'> 
        </button></div>`
    }
    board.innerHTML=htmlcode;
}

function check_winner(winnerid,state){
    let winner = true;
    let checkEquals = (b1,b2,b3) =>{
        if(state[b1]==winnerid && state[b2]== winnerid && state[b3] == winnerid){
            return true;
        }
    }
    // Checking for winner pos
    //  0 | 1 | 2
    // ---|---|---
    //  3 | 4 | 5
    // ---|---|---
    //  6 | 7 | 8
    if( checkEquals(0,4,8) || checkEquals(2,4,6) || // Diagnals
        checkEquals(0,1,2) || checkEquals(3,4,5) || checkEquals(6,7,8) || // Horizontal
        checkEquals(0,3,6) || checkEquals(1,4,7) || checkEquals(2,5,8) // Verticals
    ){
        return true;
    }

}

function check_draw(state){
    for(let i=0; i < state.length; i++){
        if(state[i]==0){
            return false;
        }
    }
    return true;
}

function reset(){
    let popup = document.getElementById('popup');
    popup.innerHTML = "";
    blockstates = [0,0,0,0,0,0,0,0,0];
    make_grid();
    popup.style.display = 'none';
    chance=1;
}

function open_WinnerDialog(winnerid){
    
    let html = `
    <div id="dialogbox">
       <h1>🎉</h1>
       <h2> Congratulation Winner is <b>Player${winnerid}</b></h2>
        <button id="rematch" onclick="reset()">Rematch</button>
    </div>
    `;
    
    
    let popup = document.getElementById('popup');
    popup.innerHTML = html;
    popup.style.display = 'flex';
}

function open_DrawDialog(){
    let html = `
    <div id="dialogbox">
       <h1>😂</h1>
       <h2> Both played well <b>Draw game</b></h2>
        <button id="rematch" onclick="reset()">Rematch</button>
    </div>
    `;
    
    
    let popup = document.getElementById('popup');
    popup.innerHTML = html;
    popup.style.display = 'flex';
}


function make_move(blockid){
    let block = document.getElementById(blockid+'-btn');
    let num = blockid.match(/(\d+)/)[0];

    if (blockstates[num]!=0)
        return;
    if(chance==1){
        block.style.background='url(./../img/cross.svg)';
        chance=2;
        blockstates[num]=1;
    }
    block.style.backgroundRepeat = 'no-repeat';
    block.style.backgroundSize = '80%';
    block.style.backgroundPosition = 'center';
    
    if(check_winner(1,blockstates)){
        open_WinnerDialog(1);
    } else if(check_draw(blockstates)){
        open_DrawDialog();
    }else{
        make_ai_move();
    }
    if(check_winner(2,blockstates)){
        open_WinnerDialog(2);
    }
    else if(check_draw(blockstates)){
        open_DrawDialog();
    }
}

function count(arr,num){
    let ans=0;
    arr.forEach(element => {
        if(element == num){
            ans++;
        }
    });
    return ans;
}

function find_utility(state, player){
    let utility = count(state,0)+1;
    if(check_winner(player,state)){
        utility *= 1;
    }else if(check_winner(player==1?2:1,state)){
        utility *= -1;
    }else if(check_draw(state)){
        utility = 0*1;
    }
    return utility;
}

function getAvailableSpot(board){
    let stops = [];
    for(let i=0; i < board.length; i++){
        if(board[i]==0){
            stops.push(i);
        }
    }
    return stops;
}

function minmax(board,player){
    let avalSpot = getAvailableSpot(board); 
    //console.log(avalSpot);
    if(check_winner(ai,board)){
        return {score:10};
    }else if(check_winner(1,board)){
        return {score:-10};
    }else if(check_draw(board)){
        return {score:0};
    }

    let moves = [];
    let newBoard = board.map(num=>num);
    for(let i=0; i < avalSpot.length; i++){
        let move = {};
        move.index = avalSpot[i];
        newBoard[avalSpot[i]]=player;

        if(player == ai){
            let result = minmax(newBoard,1);
            move.score = result.score;
        }else{
            let result = minmax(newBoard,2);
            move.score = result.score;
        }

        newBoard[avalSpot[i]] = 0;
        moves.push(move);
    }

    let bestMove;

    if(player == ai){
        let bestScore = -10000;
        for(let i=0; i<moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else{
        let bestScore = 10000;
        for(let i = 0; i< moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i; 
            }
        }
    }
    return moves[bestMove];
}

function make_ai_move(){
    let state = minmax(blockstates,ai);
    console.log(state);
    let change = state.index;
    
    let blockid = 'block'+change.toString();
    let block = document.getElementById(blockid+'-btn');
    block.style.background='url(./../img/circle.svg)';
    block.style.backgroundRepeat = 'no-repeat';
    block.style.backgroundSize = '80%';
    block.style.backgroundPosition = 'center';
    blockstates[change]=ai;
    
    chance=1;
}

window.onload = (event)=>{
    
    make_grid();
    blockstates = [0,0,0,0,0,0,0,0,0];
}