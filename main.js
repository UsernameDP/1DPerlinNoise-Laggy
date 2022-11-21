const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const side = 900;
canvas.width = canvas.height = side;



class perlin1{
    constructor(){
        this.gradients = {};
        this.squareColor = {};
    }
    randVector = () =>{
        const a = Math.random() * 2*Math.PI;
        return {dx: Math.cos(a), dy:Math.sin(a)};
    }
    dotProduct  = (point, vec) =>{ //dot product returns how closely related two vectors are
        let gradientVec;
        let pointVec = {dx: point.x - vec.x, dy: point.y - vec.y};
        if (this.gradients[[vec.x, vec.y]]){ //if the vector exists, then use that vector
            gradientVec = this.gradients[[vec.x, vec.y]];
        }
        else{ //otherwise, create an entirely new vector
            this.gradients[[vec.x, vec.y]] = this.randVector();
            gradientVec = this.gradients[[vec.x, vec.y]];
        }

        
        return pointVec.dx * gradientVec.dx + pointVec.dy * gradientVec.dy;
    }
    fade = (x) =>{
        return 6*x**5 - 15*x**4 + 10*x**3;
    }

    interp = (x, p1, p2) =>{
        return p1 + this.fade(x) * (p2-p1); //what percentage of the way did x travel? like t in bezier curves
    }

    get = (x,y)=>{
        const xF = Math.floor(x); // x floored to get the correct gradient
        const yF = Math.floor(y);  // y floored to get the correct gradient

        const point = {
            x: x,
            y:y
        }
        var vec = (x,y) =>{
            return {x: x, y:y};
        }
        const tL = this.dotProduct(point, vec(xF, yF)); //tL = top Left
        const tR = this.dotProduct(point, vec(xF + 1, yF)); 
        const bL = this.dotProduct(point, vec(xF, yF + 1));
        const bR = this.dotProduct(point, vec(xF + 1, yF + 1));
        
        const xT = this.interp(x - xF, tL, tR); //xT = interpolating the top first
        const xB = this.interp(x - xF, bL, bR);
        const final = this.interp(y - yF, xT, xB);

        this.squareColor[[x,y]] = final;
        return final;
    }
}


