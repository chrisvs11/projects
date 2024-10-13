export const calculateMachineTime = (start:number,end:number, phaseName:string)  => {
    const time = end - start
    console.log(`Phase ${phaseName} took: ${time} ms`)
}