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
    const nomorWA = "6285735831982"; // GANTI DENGAN NOMOR WA KAMU
    const pesan = `Halo LEBAK_MARKETT, saya tertarik dengan:\n\n*${item.nama}*\nHarga: Rp ${item.harga.toLocaleString()}\n\nApakah masih tersedia?`;
    const link = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(link, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-100 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-600 selection:text-white">
      
      {/* NAVIGATION - ULTRA RESPONSIVE */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100 px-5 py-4 md:px-20 md:py-6 flex justify-between items-center">
        {/* LOGO DENGAN T BERBEDA WARNA */}
        <h1 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none flex-shrink-0">
          LEBAK_MARKET<span className="text-blue-500">T</span>
        </h1>

        {/* MENU */}
        <div className="flex items-center gap-3 md:gap-8">
          <div className="hidden sm:flex gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            <a href="#" className="text-black border-b-2 border-red-600 pb-1">Katalog</a>
            <a href="#" className="hover:text-black transition-colors pb-1">Archive</a>
          </div>
          <a 
            href="https://wa.me/6285735831982" 
            className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-2.5 rounded-full active:scale-90 transition-all shadow-lg shadow-zinc-200"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-6 md:px-20 py-12 md:py-24 overflow-hidden">
        <div className="max-w-5xl">
          <h2 className="text-5xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Selected <br /> <span className="text-zinc-100">GOODS</span> <br /> 
            <span className="text-blue-500">2026.</span>
          </h2>
          <p className="max-w-md text-zinc-500 text-[11px] md:text-sm leading-relaxed tracking-tight font-bold">
           A carefully curated selection with guaranteed quality. Each item has gone through a strict inspection process to ensure authenticity and the best condition for your collection.
          </p>
        </div>
      </section>

      {/* GRID KATALOG */}
      <main className="px-5 md:px-20 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
          {produk.map((item) => (
            <div key={item.id} className="group cursor-pointer" onClick={() => kirimWA(item)}>
              
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden bg-zinc-100 rounded-[2.5rem] mb-6 relative group-hover:shadow-2xl transition-all duration-500">
                <img 
                  src={item.image_url} 
                  alt={item.nama}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Badge Condition */}
                <div className="absolute top-5 left-5">
                  <span className="bg-black text-white px-3 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-xl">
                    COND: {item.kondisi || 'USED'}
                  </span>
                </div>
              </div>

              {/* Info Container */}
              <div className="space-y-2 px-2">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-black text-sm md:text-base uppercase tracking-tight leading-[1.1] flex-1">
                    {item.nama}
                  </h3>
                  <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5">  
              Size {item.size || 'OS'}
                  </span>
                </div>
                <p className= "text-lg md:text-xl font-black italic tracking-tighter text-blue-500 leading-none">
                  Rp {item.harga?.toLocaleString()}
                </p>
              </div>

              {/* Tombol: Fixed di Mobile, Hover di PC */}
              <div className="mt-6 md:overflow-hidden md:h-0 md:group-hover:h-14 transition-all duration-500 ease-in-out px-1">
                <button className="w-full h-12 md:h-14 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-red-600">
                  Amankan Sekarang
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>

            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-6 md:px-20 py-20 bg-zinc-950 text-white mt-20 rounded-t-[3rem]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
              LEBAK_MARKET<span className="text-blue-500">T</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">The Urban Archive Store</p>
          </div>
          <div className="grid grid-cols-2 gap-10 md:text-right">
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 italic">Socials</p>
              <ul className="text-xs font-bold space-y-2 uppercase tracking-tighter">
                <li><a href="#" className="hover:text-red-600 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">TikTok</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 italic">Support</p>
              <ul className="text-xs font-bold space-y-2 uppercase tracking-tighter">
                <li><a href="#" className="hover:text-red-600 transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-4 text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
          <p>© 2026 LEBAK_MARKETT archive.</p>
          <p className="text-white italic">Curated with pride in Indonesia.</p>
        </div>
      </footer>

    </div>
  );
}