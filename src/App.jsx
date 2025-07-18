import { use, useState } from "react";

import "./App.css";

function Spl({ friend, onOpas, openas }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friendlist
          img={friend.image}
          key={friend.id}
          name={friend.name}
          balance={friend.balance}
          onOpas={onOpas}
          friend={friend}
          openas={openas}
        ></Friendlist>
      ))}
    </ul>
  );
}

function Friendlist({ img, id, name, balance, onOpas, friend, openas }) {
  const isSelected = openas?.id === friend.id;
  return (
    <li key={id}>
      <img src={img} alt="image" />
      <h3>{name}</h3>
      {balance < 0 && (
        <p className="red">
          Kamu berhutang Rp{Math.abs(balance)} ke {name}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {name} berhutang Rp{Math.abs(balance)} ke kamu
        </p>
      )}
      {friend.balance === 0 && <p>Kamu dan {name} tidak ada hutang</p>}
      <button className="button" onClick={() => onOpas(friend)}>
        {isSelected ? "Tutup" : "Tekan"}
      </button>
    </li>
  );
}

function AddFriend({ addfr }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48?u=");
  function tambahdata(e) {
    e.preventDefault();
    if (!name || !img) return;
    const id = crypto.randomUUID();
    const newData = {
      id: id,
      name: name,
      image: `${img}${id}`,
      balance: 0,
    };

    setImg("https://i.pravatar.cc/48?u=");
    setName("");
    addfr(newData);
  }
  return (
    <form className="form-add-friend" onSubmit={tambahdata}>
      <h2>Tambah Teman</h2>
      <label>Nama</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Gambar</label>
      <input type="text" value={img} />
      <button className="button" type="submit">
        Simpan
      </button>
    </form>
  );
}

function SplitBill({ data, tanggung }) {
  const [tagihan, setTotaltag] = useState("");
  const [tagm, setTagm] = useState("");
  const [penanggung, SetP] = useState("Saya");
  const totag = tagihan ? tagihan - tagm : "";

  function handle(e) {
    e.preventDefault();
    if (!tagihan || !tagm) return;
    tanggung(penanggung === "Saya" ? totag : -Number(tagm));
  }
  return (
    <form className="form-split-bill" key={data.id} onSubmit={handle}>
      <h2>Patungan Bareng {data.name}</h2>
      <label>Total Tagihan</label>
      <input
        type="text"
        value={tagihan}
        onChange={(e) => setTotaltag(e.target.value)}
      />
      <label>Tagihan Saya</label>
      <input
        type="text"
        value={tagm}
        onChange={(e) => setTagm(e.target.value)}
      />
      <label>Tagihan {data.name}</label>
      <input type="text" disabled value={totag} />
      <label>Ditalangin Sama</label>
      <select onChange={(e) => SetP(e.target.value)}>
        <option value="Saya">Saya</option>
        <option value="Teman">{data.name}</option>
      </select>
      <button className="button" type="submit">
        Simpan
      </button>
    </form>
  );
}

function App() {
  const [data, setData] = useState([
    {
      id: 118836,
      name: "Javier",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQGcpdPVwUj7bQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1693663397241?e=2147483647&v=beta&t=tR9wW2koXzWnpPCu_6MinqwJa6N2aGFNc3wyscExkj0",
      balance: 0,
    },
  ]);

  const [openbw, SetOpbw] = useState(false);
  const [openas, SetOpenas] = useState(null);

  function onOpbw() {
    SetOpbw((openbw) => !openbw);
    SetOpenas(null);
  }

  function onOpas(friend) {
    SetOpenas((selected) => (selected?.id === friend.id ? null : friend));
    SetOpbw(false);
  }

  function addfr(newf) {
    setData((data) => [...data, newf]);
  }
  function tanggung(value) {
    setData((friends) =>
      friends.map((friend) =>
        friend.id === openas.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    SetOpenas(null);
  }

  return (
    <>
      <h1>Split Bill Hadiah Buat Teman Teman</h1>
      <br />
      <div className="app">
        <div className="sidebar">
          <Spl friend={data} onOpas={onOpas} openas={openas}></Spl>
          {openbw && <AddFriend addfr={addfr}></AddFriend>}
          <button className="button" onClick={onOpbw}>
            {openbw ? "Tutup" : "Tambah Teman"}
          </button>
        </div>
        {openas && <SplitBill data={openas} tanggung={tanggung}></SplitBill>}
      </div>
    </>
  );
}

export default App;
