"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [produk, setProduk] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [size, setSize] = useState("");
  const [kondisi, setKondisi] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_access") === "true") setIsLoggedIn(true);
    ambilData();
  }, []);

  const ambilData = async () => {
    const { data } = await supabase.from("produk").select("*").order("id", { ascending: false });
    setProduk(data || []);
  };

  const mulaiEdit = (item) => {
    setEditId(item.id);
    setNama(item.nama);
    setHarga(item.harga);
    setSize(item.size || "");
    setKondisi(item.kondisi || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const batalkanEdit = () => {
    setEditId(null);
    setNama(""); setHarga(""); setSize(""); setKondisi(""); setFile(null);
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = produk.find(p => p.id === editId)?.image_url;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const safeName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('foto-produk').upload(safeName, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('foto-produk').getPublicUrl(safeName);
        imageUrl = urlData.publicUrl;
      }

      if (editId) {
        const { error } = await supabase.from("produk").update({
          nama, harga: parseInt(harga), image_url: imageUrl, size, kondisi
        }).eq("id", editId);
        if (error) throw error;
        alert("Berhasil diperbarui!");
      } else {
        if (!file) throw new Error("Pilih foto dulu!");
        const { error } = await supabase.from("produk").insert([
          { nama, harga: parseInt(harga), image_url: imageUrl, size, kondisi, status: "Tersedia" }
        ]);
        if (error) throw error;
        alert("Berhasil ditambah!");
      }
      batalkanEdit();
      ambilData();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async (id) => {
    if (confirm("Hapus barang ini?")) {
      await supabase.from("produk").delete().eq("id", id);
      ambilData();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <h1 className="text-2xl font-black mb-2 italic tracking-tighter uppercase">Admin Gate</h1>
          <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-[0.3em] font-bold">Encrypted Connection</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if(passInput === "admin123") { setIsLoggedIn(true); localStorage.setItem("admin_access", "true"); }
            else alert("Password Salah!");
          }} className="space-y-4">
            <input type="password" placeholder="••••••••" className="w-full bg-black border border-zinc-800 p-4 rounded-2xl text-center outline-none focus:ring-2 ring-white/10 transition-all text-white" onChange={e => setPassInput(e.target.value)} />
            <button className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-zinc-200 active:scale-95 transition-all">Enter Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-12 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Management</h1>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Inventory System</p>
          </div>
          <button onClick={() => { localStorage.removeItem("admin_access"); setIsLoggedIn(false); }} className="text-[10px] font-black border border-zinc-200 px-6 py-3 rounded-full uppercase tracking-tighter hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95 shadow-sm">
            Sign Out
          </button>
        </header>

        <div className="grid lg:grid-cols-5 gap-10">
          
          {/* FORM PANEL */}
          <div className="lg:col-span-2">
            <div className={`p-8 rounded-[2rem] shadow-xl transition-all duration-300 border sticky top-10 
              ${editId ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-zinc-100'}`}>
              
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">
                {editId ? "Sedang Mengedit Barang" : "Upload Barang Baru"}
              </h2>

              <form onSubmit={handleSimpan} className="space-y-5">
                <input placeholder="Nama Produk" className="w-full bg-zinc-50 border-none p-4 rounded-2xl outline-none focus:ring-2 ring-zinc-100" value={nama} onChange={e => setNama(e.target.value)} required />
                <input type="number" placeholder="Harga (IDR)" className="w-full bg-zinc-50 border-none p-4 rounded-2xl outline-none focus:ring-2 ring-zinc-100" value={harga} onChange={e => setHarga(e.target.value)} required />
                
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Size" className="w-full bg-zinc-50 border-none p-4 rounded-2xl outline-none focus:ring-2 ring-zinc-100" value={size} onChange={e => setSize(e.target.value)} />
                    <input placeholder="Kondisi" className="w-full bg-zinc-50 border-none p-4 rounded-2xl outline-none focus:ring-2 ring-zinc-100" value={kondisi} onChange={e => setKondisi(e.target.value)} />
                </div>

                {/* MODERN UPLOAD BOX */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-1">
                    {editId ? "Ganti Foto (Opsional)" : "Foto Produk"}
                  </label>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required={!editId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-full bg-zinc-50 border-2 border-dashed border-zinc-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:bg-zinc-100 group-hover:border-zinc-300 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-black"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span className="text-[10px] font-bold text-zinc-400 group-hover:text-black uppercase tracking-tight text-center">
                        {file ? file.name : "Ketuk untuk memilih foto"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button type="submit" disabled={loading} className={`w-full p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${editId ? 'bg-blue-600 text-white' : 'bg-black text-white'}`}>
                      {loading ? "SABAR..." : editId ? "SIMPAN PERUBAHAN" : "TAMBAH KE KATALOG"}
                    </button>
                    {editId && (
                        <button onClick={batalkanEdit} type="button" className="w-full p-2 text-[9px] font-black uppercase text-zinc-400 hover:text-black">Batalkan</button>
                    )}
                </div>
              </form>
            </div>
          </div>

          {/* LIST PANEL */}
          <div className="lg:col-span-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">Inventory List ({produk.length})</h2>
            <div className="grid grid-cols-1 gap-4">
              {produk.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-[1.8rem] flex items-center gap-5 border border-zinc-100 hover:shadow-xl transition-all duration-300 group">
                  <img src={p.image_url} className="w-20 h-20 object-cover rounded-2xl shadow-inner bg-zinc-50" />
                  <div className="flex-1">
                    <h3 className="font-black text-sm uppercase text-zinc-800 leading-tight">{p.nama}</h3>
                    <p className="text-blue-600 font-black text-xs mt-1">Rp {p.harga?.toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[8px] font-black px-2 py-1 bg-zinc-50 rounded text-zinc-400 uppercase">SZ: {p.size || '-'}</span>
                      <span className="text-[8px] font-black px-2 py-1 bg-zinc-50 rounded text-zinc-400 uppercase">CD: {p.kondisi || '-'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pr-2">
                    <button onClick={() => mulaiEdit(p)} className="p-3 bg-zinc-50 rounded-xl text-zinc-400 hover:bg-blue-600 hover:text-white transition-all active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleHapus(p.id)} className="p-3 bg-zinc-50 rounded-xl text-zinc-400 hover:bg-red-600 hover:text-white transition-all active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}