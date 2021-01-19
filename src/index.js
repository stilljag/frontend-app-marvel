import axios from "axios";

class App {
  constructor() {
    this.url = `http://localhost:3333/characters`;
    this.offset = 0;
    this.searchID = 0;
    this.tableBody = document.getElementById("characters");
    this.search = document.getElementById("search");
    this.viewChar = document.getElementById("viewChar");
    this.insertChar = document.getElementById("insertChar");
    this.content = document.getElementById("content");
    this.home = document.getElementById("home");
    this.buttonSearch = document.getElementById("buttonSearch");

    this.actions();
  }
  actions() {
    this.buttonSearch.onclick = (event) => this.searchCharacter(event);
    this.home.onclick = () => {
      this.content.style.display = "none";
      this.viewChar.style.display = "block";
      this.getCharacters();
    };
  }

  async getCharacters() {
    try {
      const { data } = await axios.get(`${this.url}?offset=${this.offset}`);
      this.searchID = data.characters;
      this.populate(data.characters);
      this.paginate(data.total);
    } catch (error) {
      console.log(error);
    }
  }

  populate(data) {
    this.tableBody.innerHTML = "";
    //name, id, thumbnail(path,extension)
    data.forEach((item) => {
      const tr = `<input type="image" class="img-button" width="120" height="120" data-id="${item.id}" title="${item.name}" src="${item.thumbnail.path}.${item.thumbnail.extension}">`;

      this.tableBody.innerHTML += tr;
    });

    document.querySelectorAll(".img-button").forEach((item) => {
      item.onclick = (event) => this.viewCharacter(event);
    });
  }

  async searchCharacter() {
    this.viewChar.style.display = "none";
    this.content.style.display = "block";
    if (!this.search.value) {
      alert("Personagem não encontrado");
      this.offset = 0;
      app.getCharacters();
    } else {
      try {
        this.tableBody.innerHTML = "";
        const result = await axios.get(`${this.url}/${this.search.value}`);
        this.searchID = result.data.data;
        result.data.data.forEach((item) => {
          const tr = `<input type="image" "class="img-button" width="90" height="90" data-id="${item.id}" title="${item.name}" src="${item.thumbnail.path}.${item.thumbnail.extension}">`;

          this.tableBody.innerHTML += tr;
        });
      } catch (error) {
        console.log(error);
      }
    }
    document.querySelectorAll(".img-button").forEach((item) => {
      item.onclick = (event) => {
        console.log("click");
        this.viewCharacter(event);
      };
    });
  }

  async viewCharacter(event) {
    this.viewChar.style.display = "block";
    this.content.style.display = "none";

    const id = parseInt(event.target.dataset.id);
    let thumbnail = [];
    let extension = [];
    let src = "";
    const filter = this.searchID.filter((item) => {
      if (item.id === id) {
        thumbnail.push(item.thumbnail.path);
        extension.push(item.thumbnail.extension);

        thumbnail.forEach((item) => {
          if (item.indexOf("image_not_available") !== -1) {
            console.log("achou");
            src =
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKfzTEuUt7krOR9GP2PPBsnr6wlClS6_MceQ&usqp=CAU";
          } else {
            src = `${thumbnail}.${extension}`;
          }
        });
      }
      return item.id === id;
    });
    this.viewChar.innerHTML = `<div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-left">
        <img
          src="${src}"
          class="img-thumbnail"
          alt="..."
          style="width: 35rem; height: 35rem"
        />

        <div class="col-5" style="margin: 20px">
          <div class="row mb-3">
            <label
              for="charName"
              class="col-sm-2 col-form-label col-form-label-lg"
              >Nome</label
            >
            <div class="col-sm-10">
              <input
                disabled
                type="text"
                style="border: none"
                class="form-control form-control-lg"
                id="charName"
                placeholder="${filter[0].name}"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label
              for="CharDescription"
              class="col-sm-2 col-form-label col-form-label-lg"
              >Descrição</label
            >
            <div class="col-sm-10">
              <textarea
                disabled
                cols="10"
                rows="15"
                style="resize: none; border: none"
                type="text"
                class="form-control form-control-lg"
                id="CharDescription"
                placeholder="col-form-label-sm"
              >${filter[0].description}
              </textarea>
            </div>
          </div>
        </div>

        <div class="row justify-content-end">
          <div class="col-1" style="margin-top: 20px">
            <button
              class="btn btn-secondary mx-2"
              type="button"
              id="buttonUndo"
              style="width: 70px; height: 30px"
            >
              <i class="fas fa-undo"></i> Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    const buttonUndo = document.getElementById("buttonUndo");

    buttonUndo.onclick = () => {
      this.viewChar.style.display = "none";
      this.content.style.display = "block";
    };
  }

  paginate(total) {
    document.querySelector(".pagination").innerHTML = "";
    const pages = Math.ceil(total / 100);

    for (let i = 1; i <= pages; i++) {
      const li = `<li class="page-item">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>`;

      document.querySelector(".pagination").innerHTML += li;
    }
    for (let link of document.getElementsByClassName("page-link")) {
      link.onclick = (event) => {
        const page = event.target.dataset.page;
        this.offset = (parseInt(page) - 1) * 100;
        this.getCharacters();
      };
    }
  }
}
const app = new App();
app.getCharacters();
