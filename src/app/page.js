"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  const NOMOR_WA = "6281234567890"; // GANTI DENGAN NOMOR KAMU

  useEffect(() => {
    async function ambilData() {
      const { data, error } = await supabase.from("produk").select("*").order("id", { ascending: false });
      if (error) console.error("Error:", error.message);
      else setProduk(data || []);
      setLoading(false);
    }
    ambilData();
  }, []);

  const pesanKeWA = (item) => {
    const teks = `Halo Admin, saya mau pesan:%0A%0A*${item.nama}*%0AHarga: Rp ${item.harga?.toLocaleString()}%0ASize: ${item.size || "-"}%0A%0AApakah masih ada?`;
    window.open(`https://wa.me/${NOMOR_WA}?text=${teks}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-blue-100">
      {/* Navbar Mobile Friendly */}
      <nav className="p-4 md:p-6 border-b flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-blue-600 uppercase">LEBAK_MARKETT</h1>
        <a href="/admin" className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 transition">ADMIN</a>
      </nav>

      <div className="p-4 md:p-10 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">NEW RELEASED</h2>
          <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* Grid yang responsif: 1 kolom di HP sangat kecil, 2 kolom di HP biasa, 4 di Laptop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {produk.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                  <img src={item.image_url} alt={item.nama} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 uppercase tracking-tight">{item.nama}</h3>
                  <p className="text-blue-600 font-black text-xl mb-4">Rp {item.harga?.toLocaleString()}</p>
                  
                  <div className="flex gap-2 mb-6">
                    <span className="bg-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 uppercase">Size: {item.size || "-"}</span>
                    <span className="bg-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 uppercase">{item.kondisi || "-"}</span>
                  </div>

                  <button 
                    onClick={() => pesanKeWA(item)}
                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-black text-white hover:bg-blue-600 transition-colors shadow-lg active:scale-95"
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="py-10 text-center text-gray-300 text-[10px] font-bold uppercase tracking-[0.3em]">
        © 2024 Lebak_Markett Digital Catalog
      </footer>
    </main>
  );
}