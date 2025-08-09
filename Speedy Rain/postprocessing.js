
function main(){
    let gl = document.getElementById("glslCanvas").getContext("webgl");

    if(gl === null){
        alert("Somethin didn't work :(");
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.66, 0.33, 0.99, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
}