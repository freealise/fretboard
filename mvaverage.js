var canvas = document.getElementById("canvas");
var y = [];
var avg = [];
var avg_ = [];
//var avg__ = [];
//var dist = [];
//var avg_dist = [];
var step = 32;
var t = 0;
var points = [0, 250, 60, 70, 80, 90, 100, 0]; //sort by x, step = step
    //ignore first and last zero points and curve fragments and do ramp to value
//var midpoints = [];
//var controlpoints = [];

//function mvaverage(points) {

  for (var i=0; i<points.length; i=i+2) {
    for (var x=i*step; x<(i+1)*step; x++) {
      y[x] = ((Math.cos(x*Math.PI/step)+1)*points[i]+(-Math.cos(x*Math.PI/step)+1)*points[i+1])/2;
      canvas.innerHTML+="<div style='position:absolute;left:"+x+"px;top:"+y[x]+"px;width:1px;height:1px;background-color:#ff0000'></div>";
    }
    for (var x=(i+1)*step; x<(i+2)*step; x++) {
      y[x] = ((-Math.cos(x*Math.PI/step)+1)*points[i+1]+(Math.cos(x*Math.PI/step)+1)*points[i+2])/2;
      canvas.innerHTML+="<div style='position:absolute;left:"+x+"px;top:"+y[x]+"px;width:1px;height:1px;background-color:#ff0000'></div>";
    }
  }
  

  var t = 0;
  var y = [];
  //midpoints[-1] = [0,0];
  //controlpoints[-1] = [0,0];
  for (var i=0; i<points.length-1; i++) {
    canvas.innerHTML+="<div style='position:absolute;left:"+(t-2)+"px;top:"+(points[i]-2)+"px;width:5px;height:5px;background-color:#ff00ff'></div>";
    t += step;
  }
    //midpoints[i] = [];
    for (var x=0; x<points.length*step; x++) {
        var i = parseInt(x/step);
        var t = i*step;
        y[x] = (points[i+1]-points[i])/(step)*(x-t)+points[i];
        canvas.innerHTML+="<div style='position:absolute;left:"+x+"px;top:"+y[x]+"px;width:1px;height:1px;background-color:#000000'></div>";
        //midpoints[i][0] = (points[i+1][0]+points[i][0])/2;
        //midpoints[i][1] = (points[i+1][1]+points[i][1])/2;
        //canvas.innerHTML+="<div style='position:absolute;left:"+(midpoints[i][0]-1)+"px;top:"+(midpoints[i][1]-1)+"px;width:3px;height:3px;background-color:#000000'></div>";
    }
  
  for (var x=0; x<y.length; x++) {

      avg_[x] = 0.0;
      for (var j=-step/2; j<step/2; j++) {
      	if (y[x+j]) {
      		avg_[x] += y[x+j];
          }
      }
      avg_[x] = avg_[x]/(step);

      /*dist[x] = y[x] - avg[x];
      avg_dist[x] = 0.0;
      for (var j=-step/2; j<step/2; j++) {
      	if (dist[x+j]) {
      		avg_dist[x] += dist[x+j];
          }
      }
      avg_dist[x] = avg_dist[x]/(step);*/
      
      //canvas.innerHTML+="<div style='position:absolute;left:"+x+"px;top:"+avg_[x]+"px;width:1px;height:1px;background-color:#00ff00'></div>";
      
      avg[x] = 0.0;
      for (var j=-step; j<step; j++) {
      	if (y[x+j]) {
      		avg[x] += y[x+j];
          }
      }
      avg[x] = avg[x]/(step*2);
      avg[x] = avg[x] + (avg_[x]-avg[x])*2;
      
      //canvas.innerHTML+="<div style='position:absolute;left:"+x+"px;top:"+avg[x]+"px;width:1px;height:1px;background-color:#0000ff'></div>";
      
      //avg[x] = y[x]+(y[x]-avg_[x]);
      canvas.innerHTML+="<div style='position:absolute;left:"+x+"px;top:"+avg[x]+"px;width:1px;height:1px;background-color:#0000ff'></div>";
  }
  
/*        for (var i=0; i<points.length; i++) {
          controlpoints[i] = [];
          controlpoints[i][0] = points[i][0];
          controlpoints[i][1] = avg[points[i][0]];
          //canvas.innerHTML+="<div style='position:absolute;left:"+(controlpoints[i][0]-1)+"px;top:"+(controlpoints[i][1]-1)+"px;width:3px;height:3px;background-color:#ff0000'></div>";
          
          for (var x=controlpoints[i-1][0]; x<controlpoints[i][0]; x++) {
            y[x] = (controlpoints[i][1]-controlpoints[i-1][1])/(controlpoints[i][0]-controlpoints[i-1][0])*(x-controlpoints[i-1][0])+controlpoints[i-1][1];
            //canvas.innerHTML+="<div style='position:absolute;left:"+x+"px;top:"+y[x]+"px;width:1px;height:1px;background-color:#000000'></div>";
            
            avg_[x] = 0.0;
            for (var j=-step/4; j<step/4; j++) {
            	if (y[x+j]) {
            		avg_[x] += y[x+j];
                }
            }
            avg_[x] = avg_[x]/(step/2);
            canvas.innerHTML+="<div style='position:absolute;left:"+x+"px;top:"+avg_[x]+"px;width:1px;height:1px;background-color:#ff0000'></div>";
          }
        }
  */
  //return avg;
//}
