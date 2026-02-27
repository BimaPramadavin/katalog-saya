"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passInput, setPassInput] = useState("");
  
  // DATA STATES
  const [produk, setProduk] = useState([]);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [status, setStatus] = useState("Tersedia");
  const [loading, setLoading] = useState(false);

  // 1. FUNGSI LOGIN SEDERHANA
  const handleLogin = (e) => {
    e.preventDefault();
    const PASSWORD_RAHASIA = "awiligarsolid"; // <--- GANTI PASSWORD KAMU DI SINI

    if (passInput === PASSWORD_RAHASIA) {
      setIsLoggedIn(true);
      localStorage.setItem("admin_access", "true"); // Biar tidak login terus saat refresh
    } else {
      alert("Password Salah!");
    }
  };

  // Cek session saat pertama buka
  useEffect(() => {
    const session = localStorage.getItem("admin_access");
    if (session === "true") setIsLoggedIn(true);
    ambilData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_access");
    setIsLoggedIn(false);
  };

  // 2. FUNGSI DATABASE (Sama seperti sebelumnya)
  const ambilData = async () => {
    const { data } = await supabase.from("produk").select("*").order("id", { ascending: false });
    setProduk(data || []);
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("produk").insert([
      { nama, harga: parseInt(harga), image_url: image, status, size, kondisi }
    ]);
    if (error) alert("Gagal: " + error.message);
    else {
      alert("Berhasil!");
      setNama(""); setHarga(""); setImage(""); setSize(""); setKondisi("");
      ambilData();
    }
    setLoading(false);
  };

  const handleHapus = async (id) => {
    if (confirm("Yakin hapus?")) {
      await supabase.from("produk").delete().eq("id", id);
      ambilData();
    }
  };

  // --- TAMPILAN HALAMAN LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl">
          <h1 className="text-2xl font-black mb-2 italic">ADMIN GATE</h1>
          <p className="text-gray-500 text-xs mb-6 uppercase tracking-widest">Restricted Access Only</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Masukkan Password" 
              className="w-full bg-black border border-gray-700 p-4 rounded-2xl text-center focus:border-blue-500 outline-none transition-all"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
              ENTER SYSTEM
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TAMPILAN HALAMAN ADMIN (Sama seperti sebelumnya) ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black italic">DASHBOARD ADMIN</h1>
          <button onClick={handleLogout} className="text-[10px] font-bold bg-red-100 text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all">
            LOGOUT
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Kolom Input */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Tambah Stok</h2>
            <form onSubmit={handleSimpan} className="space-y-4">
               <input placeholder="Nama Barang" className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:border-blue-500" value={nama} onChange={e => setNama(e.target.value)} required />
               <input type="number" placeholder="Harga" className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:border-blue-500" value={harga} onChange={e => setHarga(e.target.value)} required />
               <input placeholder="URL Gambar" className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:border-blue-500" value={image} onChange={e => setImage(e.target.value)} required />
               <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Size" className="border p-3 rounded-xl bg-gray-50 outline-none focus:border-blue-500" value={size} onChange={e => setSize(e.target.value)} />
                  <input placeholder="Kondisi" className="border p-3 rounded-xl bg-gray-50 outline-none focus:border-blue-500" value={kondisi} onChange={e => setKondisi(e.target.value)} />
               </div>
               <button type="submit" disabled={loading} className="w-full p-4 rounded-2xl font-black text-white bg-black hover:bg-blue-600 transition-all shadow-lg">
                  {loading ? "SAVING..." : "SIMPAN PRODUK"}
               </button>
            </form>
          </div>

          {/* Kolom Daftar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Stok Saat Ini ({produk.length})</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {produk.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-2xl bg-gray-50 group">
                  <img src={item.image_url} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-sm truncate uppercase">{item.nama}</p>
                    <p className="text-blue-600 font-black text-xs">Rp {item.harga?.toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleHapus(item.id)} className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-xl text-[10px] font-bold transition-all">
                    HAPUS
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}