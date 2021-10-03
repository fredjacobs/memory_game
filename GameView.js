class GameView {
  rowLength = 4;

  rowOne = document.querySelector("#row_1").children;
  rowTwo = document.querySelector("#row_2").children;
  rowThree = document.querySelector("#row_3").children;
  rowFour = document.querySelector("#row_4").children;
  //list = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  list = [9, 10, 11, 12, 13, 14, 15, 16, 9, 10, 11, 12, 13, 14, 15, 16];

  shuffleBlocks() {
    this.list = this.list.sort(() => Math.random() - 0.5);
    console.log(this.list);
    //console.log(this.list.length);
  } //
  assignBlocks() {
    for (let i = 0; i < this.rowOne.length; i++) {
      //this.rowOne[i] = this.list[i];
      //rowOne[i].innerHTML = list[i];
      this.rowOne[i].setAttribute("data-number", this.list[i]);
    }

    for (let j = this.rowLength, i = 0; j < 8; j++, i++) {
      //this.rowTwo[i] = list[j];
      //rowTwo[i].innerHTML = list[j];
      this.rowTwo[i].setAttribute("data-number", this.list[j]);
    }

    for (
      let j = this.rowLength * 2, i = 0;
      j < this.list.length - this.rowLength;
      j++, i++
    ) {
      //this.rowThree[i] = this.list[j];
      //rowThree[i].innerHTML = list[j];
      this.rowThree[i].setAttribute("data-number", this.list[j]);
    }

    for (let j = this.rowLength * 3, i = 0; j < this.list.length; j++, i++) {
      //this.rowFour[i] = this.list[j];
      //rowFour[i].innerHTML = list[j];
      this.rowFour[i].setAttribute("data-number", this.list[j]);
    }
  }
}
//const game = new GameView();

export { GameView };
