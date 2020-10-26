function removeFromeArray(arr,elt) {
 for (var i=arr.length-1;i>=0;i--){     //will skip element if u move forword
   if(arr[i] == elt){
     arr.splice(i,1);
   }
 }
}

function heuristic(a,b) {
  //var d= dist(a.i,a.j,b.i,b.j);
  var d= abs(a.i - b.i)+ abs(a.j - b.j);
  return d;
}
var cols = 50;
var rows = 50;
//creating array
var grid = new Array(cols);

var openSet =[]; //
var closeSet =[]; //

var start;
var end;
//wight ahd hight of the cell to keep the cell size realtive 
var w,h;
var path=[];

function Spot(i,j){
  //use for showing the spots
  this.i =i;
  this.j =j;
  this.f =0;
  this.g =0;
  this.h =0;
  this.neighbors=[];
  this.previous=undefined;
  this.wall = false;
  if (random(1)<0.4){
    this.wall= true;
  }
  this.show = function(col){//col is colour
    fill(col);
     if(this.wall){
      fill(0);
    }
    noStroke();
    rect(this.i * w,this.j * h, w-1, h-1)
  }
   this.addNeighbours = function (grid) {
     var i= this.i;
     var j= this.j;
     if (i<cols-1){
     this.neighbors.push(grid[i+1][j]);
     }
     if (i> 0){
    this.neighbors.push(grid[i-1][j]);
    }
    if(j<rows-1){
    this.neighbors.push(grid[i][j+1]);
    }
    if (j>0){
    this.neighbors.push(grid[i][j-1]);
    }
    if(i>0 && j>0){
      this.neighbors.push(grid[i-1][j-1]); //diagonal path
    }
    if(i<cols-1 && j>0){
      this.neighbors.push(grid[i+1][j-1]);
    }
    if(i>0 && j<rows -1){
      this.neighbors.push(grid[i-1][j+1]);
    }
    if(i<cols-1 && j<rows-1){
      this.neighbors.push(grid[i+1][j+1]);
    }
  }
}

function setup() {
  createCanvas(400, 400);
  console.log('A*');
  w = width / cols;
  h= height /rows;
  
  //Making a 2D array
  for (var i=0;i < cols;i++){
    grid[i] = new Array(rows);
  }
  
  for (var i=0;i<cols;i++){
    for (var j=0;j<rows;j++){
    grid[i][j] = new Spot(i,j);
   }
  }
  //adding neighbours after creating spots
  for (var i=0;i<cols;i++){
    for (var j=0;j<rows;j++){
    grid[i][j].addNeighbours(grid);
   }
  }  

start = grid[0][0];
end = grid[cols -1][rows -1];
start.wall=false;
end.wall=false;
openSet.push(start);

}
 
//using insted of while loop
function draw() {

  if (openSet.length > 0){

    var lowestIndex=0;
    for (var i=0; i < openSet.length; i++){
     if(openSet[i].f < openSet[lowestIndex].f){
     lowestIndex=i;
     }
    }
    var current = openSet[lowestIndex];
    
    if (current === end){
      
      noLoop();
      console.log("DONE!");
    }
     removeFromeArray(openSet,current);//javascript does not have remove funtion'openset.remove'
     closeSet.push(current);

    var neighbors = current.neighbors;
    for (var i=0; i < neighbors.length; i++){
      var neighbor = neighbors[i];
      
      if(!closeSet.includes(neighbor) && !neighbor.wall){
        var tempG = current.g + 1; 
        
        var newPath = false;
        if (openSet.includes(neighbors)){  //to check wheather it evavulated before
          if (tempG < neighbor.g){            // is it better g
            neighbor.g = tempG;
            newPath=true;
          } 
          }else{
          neighbor.g =tempG;
          newPath=true;
          openSet.push(neighbor);    //if not there add it
        }
        if(newPath){
        neighbor.h= heuristic(neighbor,end);//guessing
        neighbor.f= neighbor.g+neighbor.h;
        neighbor.previous = current;
        }
      }
      
     }                                          //we can keep giong
  }
  else{
    console.log('no solution');
    noLoop();
    return; //no solution
   }
  background(220);

  for (var i=0;i<cols;i++){
    for (var j=0;j<rows;j++){
    grid[i][j].show(color(255));
   }
  }

  for (var i=0;i < closeSet.length; i++){
    closeSet[i].show(color(255,0,0));
  }
 for (var i=0; i <  openSet.length;i++){
    openSet[i].show(color(0,255,0)); 
  }
  //find the path
   
    path=[];
    var temp=current;
    path.push(temp);
    while (temp.previous){
    path.push(temp.previous);  //tracking the path
    temp = temp.previous;
    }
  
  for (var i=0;i< path.length;i++){
    path[i].show(color(0,0,255));
  }

}
