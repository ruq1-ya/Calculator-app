const display = document.getElementById('display');
let calculated = false;


function calculate(value){
    if(display.value === "Error"){
        if(isOperator(value)){
            display.value=value;
        }
        else{
            display.value=value;
        }
        calculated=false;
        return;
    }
    if (calculated && !isOperator(value)){
        display.value = value;
        calculated=false;
    }
    else{
        display.value+=value;
        calculated = false;
    }
}

function result(){
    try{
        let expression = display.value.replace(/×/g,'*').replace(/÷/,'/');
        expression = percent(expression);
        display.value = eval(expression);
    }catch{
        display.value="Error";
    }
    calculated=true;
}

function clearDisplay(){
    display.value="";
    calculated=false;
}

function Delete(){
    display.value= display.value.slice(0,-1);
}

function isOperator(val){
    return['+','-','÷','×','%'].includes(val)
}

function percent(exp){
    exp = exp.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    exp = exp.replace(/(\d+(\.\d+)?)([+\-])(\d+(\.\d+)?)\/100/g,'($1$3($1*$4/100))');
    return exp;

}