import { Button } from "antd";

const MovieCard = ({ movie }: { movie: any }) => (
  <div className="group relative bg-white rounded shadow-sm overflow-hidden hover:shadow-2xl transition duration-300 border border-gray-200">
    {/* Image Container */}
    <div className="overflow-hidden aspect-[2/3] relative">
      <img
        src={movie.image}
        alt={movie.title}
        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute top-2 left-2 bg-[#ce1212] text-white text-[10px] font-bold px-2 py-1 rounded shadow z-10">
        2D
      </div>

      {/* Overlay Hover Effect */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-3 p-4 z-20">
        <Button
          type="primary"
          danger
          size="large"
          className="w-full font-bold uppercase !bg-[#ce1212] !border-[#ce1212] hover:!bg-red-700"
        >
          Mua vé
        </Button>
        <Button
          ghost
          size="large"
          className="w-full font-bold uppercase !text-white !border-white hover:!text-[#ce1212] hover:!border-[#ce1212] hover:!bg-white"
        >
          Chi tiết
        </Button>
      </div>
    </div>
    
    {/* Info Container */}
    <div className="p-3 text-center bg-white h-16 flex items-center justify-center">
      <h3 className="font-bold text-[13px] md:text-sm text-gray-800 uppercase line-clamp-2 group-hover:text-[#ce1212] transition">
        {movie.title}
      </h3>
    </div>
  </div>
);

export default MovieCard