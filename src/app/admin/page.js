"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [produk, setProduk] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // States untuk Form
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Pilih foto dulu bos!");
    setLoading(true);

    try {
      // 1. MEMBERSIHKAN NAMA FILE (PENTING: Menghindari error 'Invalid Key')
      const fileExt = file.name.split('.').pop();
      const safeName = `${Date.now()}.${fileExt}`; 

      // 2. Upload ke Storage Supabase
      const { error: uploadError } = await supabase.storage
        .from('foto-produk')
        .upload(safeName, file);

      if (uploadError) throw uploadError;

      // 3. Ambil Link Publik Foto
      const { data: urlData } = supabase.storage.from('foto-produk').getPublicUrl(safeName);
      const imageUrl = urlData.publicUrl;
      
      // 4. Simpan Data ke Tabel Produk
      const { error: insertError } = await supabase.from("produk").insert([
        { 
          nama, 
          harga: parseInt(harga), 
          image_url: imageUrl,
          size,
          kondisi,
          status: "Tersedia"
        }
      ]);

      if (insertError) throw insertError;

      alert("Barang Berhasil Ditambahkan!");
      
      // Reset Form
      setFile(null); setNama(""); setHarga(""); setSize(""); setKondisi("");
      // Refresh Data
      ambilData();
    } catch (err) {
      alert("Waduh Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async (id) => {
    if (confirm("Yakin mau hapus barang ini?")) {
      await supabase.from("produk").delete().eq("id", id);
      ambilData();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passInput === "admin123") { // Ganti password di sini
      setIsLoggedIn(true);
      localStorage.setItem("admin_access", "true");
    } else {
      alert("Password Salah!");
    }
  };

  // --- TAMPILAN HALAMAN LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-sm w-full bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 shadow-2xl text-center">
          <h1 className="text-2xl font-black mb-2 italic tracking-tighter uppercase">Admin Gate</h1>
          <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-[0.3em] font-bold">Authorized Personnel Only</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Password" 
              className="w-full bg-black border border-zinc-800 p-4 rounded-2xl text-center focus:border-white outline-none transition-all text-white"
              onChange={e => setPassInput(e.target.value)} 
            />
            <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all uppercase text-xs tracking-widest">
              Enter System
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TAMPILAN DASHBOARD UTAMA ---
  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-12 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Dashboard</h1>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Inventory & Stock</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("admin_access"); setIsLoggedIn(false); }} 
            className="text-[10px] font-black bg-zinc-100 px-6 py-3 rounded-full hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
          >
            Logout
          </button>
        </header>

        <div className="grid lg:grid-cols-5 gap-10">
          
          {/* KOLOM KIRI: FORM TAMBAH BARANG */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-zinc-100 border border-zinc-50 sticky top-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">Add New Product</h2>
              <form onSubmit={handleUpload} className="space-y-5">
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black ml-1 text-zinc-400 uppercase tracking-widest">Product Name</label>
                  <input placeholder="Contoh: Nike Air Jordan" className="w-full bg-zinc-50 border-none p-4 rounded-2xl focus:ring-2 ring-black outline-none transition-all" value={nama} onChange={e => setNama(e.target.value)} required />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black ml-1 text-zinc-400 uppercase tracking-widest">Price (Rp)</label>
                  <input type="number" placeholder="1500000" className="w-full bg-zinc-50 border-none p-4 rounded-2xl focus:ring-2 ring-black outline-none transition-all" value={harga} onChange={e => setHarga(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-[9px] font-black ml-1 text-zinc-400 uppercase tracking-widest">Size</label>
                    <input placeholder="42, L, XL" className="w-full bg-zinc-50 border-none p-4 rounded-2xl focus:ring-2 ring-black outline-none transition-all" value={size} onChange={e => setSize(e.target.value)} />
                   </div>
                   <div className="space-y-1">
                    <label className="text-[9px] font-black ml-1 text-zinc-400 uppercase tracking-widest">Condition</label>
                    <input placeholder="9/10, New" className="w-full bg-zinc-50 border-none p-4 rounded-2xl focus:ring-2 ring-black outline-none transition-all" value={kondisi} onChange={e => setKondisi(e.target.value)} />
                   </div>
                </div>

                <div className="space-y-1 pb-2">
                  <label className="text-[9px] font-black ml-1 text-zinc-400 uppercase tracking-widest">Upload Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full text-[10px] text-zinc-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[9px] file:font-black file:bg-black file:text-white hover:file:bg-zinc-800 transition-all cursor-pointer" 
                    onChange={e => setFile(e.target.files[0])} 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-black text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 disabled:bg-zinc-300 transition-all"
                >
                  {loading ? "Processing..." : "Push to Catalog"}
                </button>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: DAFTAR INVENTORY */}
          <div className="lg:col-span-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">Live Inventory ({produk.length})</h2>
            <div className="grid grid-cols-1 gap-4">
              {produk.length === 0 && (
                <div className="text-center py-20 bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-100">
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest text-center">No items found</p>
                </div>
              )}
              {produk.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-3xl flex items-center gap-5 border border-zinc-100 hover:shadow-xl hover:shadow-zinc-100/50 transition-all group">
                  <img src={p.image_url} className="w-20 h-20 object-cover rounded-2xl shadow-inner bg-zinc-100" />
                  <div className="flex-1">
                    <h3 className="font-black text-sm uppercase tracking-tight text-zinc-800">{p.nama}</h3>
                    <p className="text-blue-600 font-black text-xs">Rp {p.harga?.toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[8px] font-black px-2 py-1 bg-zinc-100 rounded text-zinc-500 uppercase tracking-tighter">Size: {p.size || '-'}</span>
                      <span className="text-[8px] font-black px-2 py-1 bg-zinc-100 rounded text-zinc-500 uppercase tracking-tighter">Cond: {p.kondisi || '-'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleHapus(p.id)} 
                    className="opacity-0 group-hover:opacity-100 p-4 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
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