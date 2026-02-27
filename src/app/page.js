"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function KatalogPage() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ambilData();
  }, []);

  const ambilData = async () => {
    const { data } = await supabase.from("produk").select("*").order("id", { ascending: false });
    setProduk(data || []);
    setLoading(false);
  };

  const kirimWA = (item) => {
    const pesan = `Halo, saya tertarik dengan produk: *${item.nama}* - Rp ${item.harga.toLocaleString()}. Apakah masih tersedia?`;
    const link = `https://wa.me/62085735831982?text=${encodeURIComponent(pesan)}`; // Ganti nomor WA kamu
    window.open(link, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-100 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* NAVIGATION - Glassmorphism Sticky */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-6 md:px-20 flex justify-between items-center">
        <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">
          Lebak_Market<span className="text-zinc-400">T</span>
        </h1>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          <a href="#" className="text-black">Katalog</a>
          <a href="#" className="hover:text-black transition-colors">About</a>
          <a href="#" className="hover:text-black transition-colors">Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-6 md:px-20 py-16 md:py-24 border-b border-zinc-100">
        <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-6">
          Selected <br /> <span className="text-zinc-300">Goods 2026</span>
        </h2>
        <p className="max-w-md text-zinc-500 text-sm leading-relaxed">
          Koleksi pilihan terbaik dengan kualitas terjamin. Setiap barang telah melewati proses pemeriksaan ketat untuk memastikan keaslian dan kondisi terbaik bagi koleksi Anda.
        </p>
      </section>

      {/* GRID KATALOG */}
      <main className="px-6 md:px-20 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {produk.map((item) => (
            <div key={item.id} className="group relative cursor-pointer" onClick={() => kirimWA(item)}>
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden bg-zinc-100 rounded-3xl mb-6 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <img 
                  src={item.image_url} 
                  alt={item.nama}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Badge Condition */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-widest shadow-sm">
                    Cond: {item.kondisi || '9/10'}
                  </span>
                </div>
              </div>

              {/* Info Container */}
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-sm uppercase tracking-tight leading-tight max-w-[70%]">
                    {item.nama}
                  </h3>
                  <span className="text-xs font-bold text-zinc-400 tracking-tighter uppercase">
                    {item.size || 'ALL SIZE'}
                  </span>
                </div>
                <p className="text-lg font-black italic tracking-tighter text-blue-600">
                  IDR {item.harga?.toLocaleString()}
                </p>
              </div>

              {/* Hover Trigger - View Detail Button */}
              <div className="mt-4 overflow-hidden h-0 group-hover:h-12 transition-all duration-500">
                <button className="w-full h-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2">
                  Amankan Sekarang
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-6 md:px-20 py-20 bg-zinc-50 border-t border-zinc-100 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Lebak_Markett</h1>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Developed with Passion</p>
            <p className="text-xs text-zinc-500 italic">© 2026 All Rights Reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}