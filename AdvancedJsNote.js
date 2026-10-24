function arg(fst,sec,Thrd)
{
console.log(arguments)  
}
arg(1,2,3)
//////////////////// editing to arguments (not Recommended)
object like =>  arguments = {"0" : 1 , "1" : 2 , "2" : 3 , length : 3}
to get it as array we can use Object.enteries(arguments) >> [[0,1],[1,2],[2,3],[length,3]]
to get is as array we can use Object.keys(arguments) >> ["0", "1", "2", "length"]
to get it as array we can use Object.values(arguments) >> [1,2,3,3]