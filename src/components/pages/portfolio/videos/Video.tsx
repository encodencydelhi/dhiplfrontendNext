"use client";

import React, { useState, useEffect } from "react";
import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { api, API_URL } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cleanDescription } from "@/lib/utils";

interface VideoData {
    _id: string;
    title: string;
    videoId: string;
}

interface PortfolioData {
    heading: string;
    highlightedWord: string;
    shortDescription: string;
    bgImage: string;
    videos: VideoData[];
}

const Video = () => {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/video-portfolio");
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching video portfolio:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE802B]"></div>
            </div>
        );
    }

    const videos = data?.videos || [];
    const totalPages = Math.ceil(videos.length / videosPerPage);
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    return (
        <div className="bg-white min-h-screen">
            <Topbar />
            <Navbar />

            {/* HERO */}
            <section className="relative h-[45vh] min-h-[350px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.65)), url('${data?.bgImage?.startsWith('http') ? data.bgImage : `${API_URL}${data?.bgImage}`}')`,
                    }}
                />
                <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif">
                            {data?.heading?.split(data?.highlightedWord)[0]}
                            <span className="text-[#DE802B]">{data?.highlightedWord}</span>
                            {data?.heading?.split(data?.highlightedWord)[1]}
                        </h1>
                        <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
                            {cleanDescription(data?.shortDescription)}
                        </p>
                    </div>
                </div>
            </section>

            {/* VIDEOS GRID */}
            <section className="py-14 bg-white">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentVideos.map((video) => (
                            <div key={video._id} className="bg-black group">
                                {/* YouTube Embed */}
                                <LiteYouTubeEmbed
                                    id={video.videoId}
                                    title={video.title}
                                    poster="maxresdefault"
                                    wrapperClass="yt-lite rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
                                />

                                {/* Title Bar */}
                                <div className="bg-black px-3 py-3 border-t border-gray-800">
                                    <p className="text-white text-sm font-medium truncate">
                                        {video.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-full border transition-colors ${currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#134698] text-[#134698] hover:bg-[#134698] hover:text-white'}`}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${currentPage === i + 1 ? 'bg-[#134698] text-white scale-110 shadow-lg' : 'text-[#134698] hover:bg-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-full border transition-colors ${currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#134698] text-[#134698] hover:bg-[#134698] hover:text-white'}`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                    
                    {videos.length === 0 && !isLoading && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No videos found in the portfolio.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Video;