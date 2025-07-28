// components/SpotifyEmbed.jsx
import './SpotifyEmbed.css';   // ⭐ NEW: import the CSS

const SpotifyEmbed = ({ playlistUrl }) => {
  if (!playlistUrl) return <p>No playlist added.</p>;

  const embedUrl = playlistUrl.replace("open.spotify.com", "open.spotify.com/embed");

  return (
    <div className="spotify-embed-wrapper">   {/* ⭐ NEW wrapper div */}
      <iframe
        src={embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        title="Spotify Playlist"
      ></iframe>
    </div>
  );
};

export default SpotifyEmbed;
