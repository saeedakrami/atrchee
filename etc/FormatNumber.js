function numberWithCommas(number) {
    if(number){
        return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
    }
   return  number
}
export {numberWithCommas}