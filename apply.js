document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-pause')
    const width = 10;
    let score =0;
    let nextrandom =0;
    let timerId;

    const L_shape = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const T_shape= [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const Z_shape= [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const I_shape = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const O_shape =[
        [0, width, 1, width+1],
        [0, width, 1, width+1],
        [0, width, 1, width+1],
        [0, width, 1, width+1]
    ]
    
    const Shapes= [L_shape, T_shape, Z_shape, I_shape, O_shape];

    let current_position= 4;
    let current_rotation=0;
    let random =Math.floor(Math.random()*(Shapes.length));
    let current= Shapes[random][current_rotation];

    function draw(){
        current.forEach( index =>{
            squares[current_position + index].classList.add('tetrimon');
        })
    }

    function undraw(){
        current.forEach(index =>{
            squares[current_position + index].classList.remove('tetrimon');
        })
    }

    //timerId = setInterval(movedown, 200);

    function movedown(){
        //if(current_position==4) draw();
        undraw();
        current_position+= width;
        draw();
        stop();
    }

    function stop(){
        if(current.some(index=> squares[index +current_position+ width].classList.contains('taken'))){
            current.forEach(index=> squares[index +current_position].classList.add('taken'))

            random = nextrandom;
            nextrandom= Math.floor(Math.random()*(Shapes.length));
            current= Shapes[random][current_rotation];
            current_position=4;
            draw();
            displayshape();
            addScore();
            gameOver();
        }
    }
    
    function keys(e){
        if(e.keyCode === 37)
        {
            moveleft();
        }
        else if(e.keyCode === 38)
        {
            rotate();
        }
        else if(e.keyCode === 39)
        {
            moveright();
        }
        else if(e.keyCode === 40)
        {
            draw();
        }
    }
    document.addEventListener('keyup', keys);

    function moveleft(){
        undraw();
        const isleftedge = current.some(index => ((current_position+ index)%width==0) || current.some(index=> squares[index +current_position-1].classList.contains('taken')));
        if(!isleftedge) current_position-=1;
        draw();
    }

    function moveright(){
        undraw();
        const isrightedge = current.some(index => ((current_position+ index)%width==9) || current.some(index=> squares[index +current_position+1].classList.contains('taken')));
        if(!isrightedge) current_position+=1;
        draw();
    }

    function rotate(){
        undraw();
        current_rotation++;
        if(current_rotation== current.length)
        {
            current_rotation=0;
        }
        current= Shapes[random][current_rotation];
        draw();
    }

    const displaysquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayindex = 0;
    

    const nextShapes =[
        [1, displayWidth+1, displayWidth*2+1, 2], 
        [0, displayWidth, displayWidth+1, displayWidth*2+1], 
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1], 
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    function displayshape(){
        displaysquares.forEach(square => {square.classList.remove('tetrimon')});
        nextShapes[nextrandom].forEach(index => {displaysquares[displayindex +index].classList.add('tetrimon')});
    }

    StartBtn.addEventListener('click',() =>{
        if(timerId)
        {
            clearInterval(timerId);
            timerId=null;
        }else{
            draw();
            timerId = setInterval( movedown, 200);
            nextrandom= math.floor(Math.random()*Shapes.length);
            displayshape();
        }
    })

    function addScore(){
        for(let i=0;i<200;i+=width)
        {
            const row= [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken')))
            {
                score+=10;
                ScoreDisplay.innerHTML = score;
                row.forEach(index => { 
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetrimon')
                });
                const squaresremoved = squares.splice(i, width)
                squares = squaresremoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }

    }

    function gameOver() {
        if(current.some(index => squares[current_position + index].classList.contains('taken'))) {
          ScoreDisplay.innerHTML = 'end'
          clearInterval(timerId)
        }
      }
})