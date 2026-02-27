"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [produk, setProduk] = useState([]);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [status, setStatus] = useState("Tersedia");
  const [loading, setLoading] = useState(false);

  // Ambil data terbaru
  const ambilData = async () => {
    const { data, error } = await supabase.from("produk").select("*");
    if (error) {
      console.error("Error ambil data:", error.message);
    } else {
      setProduk(data || []);
    }
  };

  useEffect(() => {
    ambilData();
  }, []);

  // Simpan Produk
  const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("produk").insert([
      { 
        nama, 
        harga: parseInt(harga), 
        image_url: image, 
        status, 
        size, 
        kondisi 
      }
    ]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("Berhasil disimpan!");
      setNama(""); setHarga(""); setImage(""); setSize(""); setKondisi("");
      ambilData();
    }
    setLoading(false);
  };

  // Hapus Produk
  const handleHapus = async (id) => {
    if (confirm("Yakin hapus?")) {
      const { error } = await supabase.from("produk").delete().eq("id", id);
      if (error) alert("Gagal: " + error.message);
      else ambilData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 text-black font-sans">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6">Tambah Produk</h2>
          <form onSubmit={handleSimpan} className="space-y-4">
            <input placeholder="Nama Barang" className="w-full border p-3 rounded-xl bg-gray-50" value={nama} onChange={e => setNama(e.target.value)} required />
            <input type="number" placeholder="Harga" className="w-full border p-3 rounded-xl bg-gray-50" value={harga} onChange={e => setHarga(e.target.value)} required />
            <input placeholder="URL Foto" className="w-full border p-3 rounded-xl bg-gray-50" value={image} onChange={e => setImage(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Size" className="border p-3 rounded-xl bg-gray-50" value={size} onChange={e => setSize(e.target.value)} />
              <input placeholder="Kondisi" className="border p-3 rounded-xl bg-gray-50" value={kondisi} onChange={e => setKondisi(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">
              {loading ? "Sabar ya..." : "Simpan Produk"}
            </button>
          </form>
          <div className="mt-4"><a href="/" className="text-blue-500 text-sm">← Kembali ke Katalog</a></div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6 text-blue-600 italic">Daftar Stok ({produk.length})</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {produk.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 border rounded-2xl bg-gray-50">
                <img src={item.image_url} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-sm truncate uppercase">{item.nama}</p>
                  <p className="text-blue-600 font-bold text-xs italic">Rp {item.harga?.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => handleHapus(item.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black"
                >
                  HAPUS
                </button>
              </div>
            ))}
            {produk.length === 0 && <p className="text-gray-400 text-center py-10">Database Kosong.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}