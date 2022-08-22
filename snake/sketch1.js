function setup() {
    createCanvas(1280, 612); // size() --> createCanvas()
    fill(199,133,78,34);
    ellipse(600,300,100,100);
}

function draw() {
    if(mouseIsPressed){
        fill(50,205,50);
        for(var i=1; i<4; i++)
            ellipse(mouseX+50*(i-1),mouseY-50*(i-1), 100*i, 100*i); 
    }


    else{
        fill(99,143,178,64)
        ellipse(mouseX, mouseY, 80, 80)
    }
}