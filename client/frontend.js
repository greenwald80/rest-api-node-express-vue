import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js";

Vue.component("loader", {
  template: `
    <div style="display:flex; justify-content:center; align-items: center;">
    <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
    </div>
    </div>
    `,
});

new Vue({
  el: "#app",
  data() {
    return {
      loading: false,
      form: {
        name: "",
        value: "",
      },
      contacts: [
        // { id: 1, name: "Alex", value: "0934336764", marked: false }
      ],
    };
  },
  computed: {
    canCreate() {
      return this.form.name.trim() && this.form.value.trim(); //валидация против пустых полей
    },
  },
  methods: {
    async createContact() {
      const { ...contact } = this.form;
      //   this.contacts.push({ ...contact, id: Date.now(), marked: false });
      const newContact = await request("/api/contacts", "POST", contact);
      this.contacts.push(newContact);
      this.form.name = this.form.value = ""; //clean fields in form
    },
    async markContact(id) {
      const contact = this.contacts.find((c) => c.id === id);
      const updated = await request(`/api/contacts/${id}`, "PUT", {
        ...contact,
        marked: !contact.marked,
      });
      contact.marked = updated.marked; //синхрониация бекенда и фронтенда
    },
    async removeContact(id) {
      await request(`/api/contacts/${id}`, "DELETE");
      this.contacts = this.contacts.filter((c) => c.id !== id);
    },
  },
  async mounted() {
    //await request("http://localhost:4000/api/contacts")//можно не писать полный адрес с localhost, работаю на том же порту
    // const data = await request("/api/contacts");
    // this.contacts = data;
    this.loading = true;
    this.contacts = await request("/api/contacts");
    this.loading = false;
  },
});

async function request(url, method = "GET", data = null) {
  try {
    const headers = {};
    let body; //let использую, потому что буду переопределять, если будет не пустым data

    if (data) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body,
    });
    return response.json();
  } catch (e) {
    console.warn("Error:", e.message);
  }
}
