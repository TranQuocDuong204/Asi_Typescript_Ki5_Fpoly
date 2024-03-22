import autobind from "autobind-decorator";
import { GameItem, GameItemStatus } from "../model/GameItem";
import _ from "lodash";
export class GameController {
  private items: GameItem[] = [];

  constructor(items: GameItem[], public element: HTMLElement) {
    this.initGame(items);
  }

  initGame(initData: GameItem[]): void {
    for (const item of initData) {
      this.items.push(item);
      this.items.push(new GameItem(item.id, item.divId, item.image));
    }

    let id: number = 1;

    this.items.forEach((it) => {
      it.status = GameItemStatus.Close;
      it.divId = "d" + id;
      id++;
    });
  }

  reinitGame(): void {
    this.items.forEach(item => {
        item.imageElement = null;
        item.status = GameItemStatus.Close;
        item.isMathched = false;
    });

    this.shuffle();
  }

  isWinGame(): boolean {
     return this.items.filter(item => item.status === GameItemStatus.Open ).length === this.items.length;
  }

  renderHTML(rootElement: HTMLElement, item: GameItem) {
    //     <div class="col-2 gameItem m-2 p1 text-center">
    //     <img src="" alt="" class="img-fluid" />
    //   </div>
    const divItem: HTMLDivElement = document.createElement("div");
    divItem.className = "col-2 gameItem m-2 p1 text-center";
    divItem.id = item.divId;
    divItem.addEventListener("click", this.processGameItemClick);

    const imgItem: HTMLImageElement = document.createElement("img");

    imgItem.src = `images/${item.image}`;
    imgItem.className = "img-fluid invisible";

    item.imageElement = imgItem;
    divItem.appendChild(imgItem);
    rootElement.appendChild(divItem);
  }

  renderResetButton(rootElement: HTMLElement): void {
    let button: HTMLButtonElement = rootElement.querySelector('button') as HTMLButtonElement;
    if(button) {
        button.addEventListener('click', this.processResetButtonClicked);
    }
  }

  renderGameBoard(): void {
    this.shuffle();
    let boardDiv: HTMLElement = this.element.querySelector(
      "#board"
    ) as HTMLElement;

    if (boardDiv) {
      this.items.forEach((it) => {
        this.renderHTML(boardDiv, it);
      });
    }
    this.renderResetButton(this.element);
  }

  isMatched(id: number, imgElement: HTMLElement): boolean {
    let openItems: GameItem[] = this.items.filter((item) => {
        return item.status === GameItemStatus.Open && !item.isMathched;
    });

    if (openItems.length === 2) {
        let checkMatchedfilter = openItems.filter((item) => item.id === id);
        if (checkMatchedfilter.length < 2) {
            openItems.forEach((item) => {
                this.changeMatchedBackground(item.imageElement, false);
            });

            setTimeout(() => {
                openItems.forEach((item) => {
                    if (item.imageElement) {
                        item.imageElement.className = "img-fluid invisible";
                        item.status = GameItemStatus.Close;
                        item.isMathched = false;
                        this.changeMatchedBackground(item.imageElement);
                    }
                });
            }, 600); // Thêm dấu ngoặc nhọn và chỉ định thời gian chờ
        } else {
            openItems.forEach((item) => {
                item.isMathched = true;
                this.changeMatchedBackground(item.imageElement);
            });
            return true;
        }
    }
    return false;
}

changeMatchedBackground(
    imgElement: HTMLElement | null,
    isMatched: boolean = true
) {
    if (!imgElement?.parentElement) return; // Kiểm tra imgElement có tồn tại
    if (isMatched) {
        imgElement.parentElement.className =
            "col-2 gameItem m-1 p-1 text-center";
    } else {
        imgElement.parentElement.className =
            "col-2 gameItem m-1 p-1 text-center unmatched";
    }
}

  @autobind
  processGameItemClick(event: Event) {
    let element: HTMLElement | null = event.target as HTMLElement;

    if (element.tagName === "img") {
      element = element.parentElement;
    }
    for (const item of this.items) {
      if (
        item.divId === element?.id &&
        !item.isMathched &&
        item.status === GameItemStatus.Close
      ) {
        item.status = GameItemStatus.Open;

        let imgElement = element.querySelector("img");
        if (imgElement) {
          imgElement.className = "img-fluid visible";
          this.isMatched(item.id, imgElement);
        }
      }
    }
  }
  @autobind
  processResetButtonClicked(event: Event): void {
    this.reinitGame();

    const boardElement: HTMLElement = document.querySelector('#board') as HTMLElement;

    boardElement.innerHTML = '';

    this.renderGameBoard();
  }

  shuffle() {
    this.items = _.shuffle(this.items);
  }
}
