// components/YoutubeForm.js
"use client";
import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@nextui-org/react";

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

export default function YouTubeChannelStats() {
  const [apiKey, setApiKey] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const fetchChannelStats = async () => {
    setLoading(true);
    setError("");
    setStats(null);
    setDebug("");

    if (!apiKey) {
      setError("Por favor, ingrese una API key válida");
      setLoading(false);
      return;
    }

    try {
      const channelId = await getChannelId(channelUrl);
      setDebug((prevDebug) => prevDebug + `Channel ID: ${channelId}\n`);

      if (!channelId) {
        throw new Error("No se pudo encontrar el ID del canal");
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
      );
      const data = await response.json();
      setDebug(
        (prevDebug) =>
          prevDebug + `API Response: ${JSON.stringify(data, null, 2)}\n`
      );

      if (data.items && data.items.length > 0) {
        const channelStats = data.items[0].statistics;
        setStats({
          totalVideos: parseInt(channelStats.videoCount) || "N/A",
          viewCount: parseInt(channelStats.viewCount) || "N/A",
          subscriberCount: channelStats.hiddenSubscriberCount
            ? "Oculto"
            : parseInt(channelStats.subscriberCount) || "N/A",
          totalUpdatedContent: "N/A", // Placeholder logic
          totalDeletedContent: "N/A", // Placeholder logic
        });
      } else {
        throw new Error("No se encontraron datos para este canal");
      }
    } catch (error) {
      console.error("Error fetching channel stats:", error);
      setError(error.message || "Error al obtener estadísticas del canal");
      setDebug((prevDebug) => prevDebug + `Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const getChannelId = async (url) => {
    setDebug(`Procesando URL: ${url}\n`);

    const directMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:channel\/|@)([a-zA-Z0-9_-]+)/
    );
    if (directMatch) {
      setDebug(
        (prevDebug) =>
          prevDebug + `Coincidencia directa encontrada: ${directMatch[1]}\n`
      );
      if (directMatch[1].startsWith("UC")) {
        return directMatch[1]; // Es un ID de canal válido
      } else {
        // Es un nombre de usuario personalizado, necesitamos buscarlo
        return searchChannel(directMatch[1]);
      }
    }

    // Si no hay coincidencia directa, intentamos buscar por el nombre del canal
    const channelName = url.split("/").pop().replace("@", "");
    setDebug((prevDebug) => prevDebug + `Buscando canal: ${channelName}\n`);
    return searchChannel(channelName);
  };

  const searchChannel = async (channelName) => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${apiKey}`
    );
    const data = await response.json();
    setDebug(
      (prevDebug) =>
        prevDebug + `Búsqueda API Response: ${JSON.stringify(data, null, 2)}\n`
    );
    if (data.items && data.items.length > 0) {
      return data.items[0].id.channelId;
    }
    return null;
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold  text-center">
        Estadísticas de Canal de YouTube
      </h1>
      <h3 className="text-sm font-bold mb-6 text-center">
        Santiago Ramirez, Macjainer Molano, Jaimer Arevalo
      </h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <Card className="mb-6">
            <CardBody>
              <div className="mb-4 relative">
                <Input
                  fullWidth
                  label="API Key de YouTube"
                  placeholder="Ingrese su API Key de YouTube"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type={showApiKey ? "text" : "password"}
                />
                <Button
                  isIconOnly
                  aria-label="Toggle API Key visibility"
                  variant="light"
                  onPress={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showApiKey ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
              <Input
                fullWidth
                label="Canal de YouTube"
                placeholder="https://www.youtube.com/@username o https://www.youtube.com/channel/..."
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                className="mb-4"
              />
              <Button
                color="primary"
                onClick={fetchChannelStats}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Cargando..." : "Obtener estadísticas"}
              </Button>
            </CardBody>
          </Card>
          {error && (
            <Card className="mb-6 bg-danger-50">
              <CardBody>
                <p className="text-danger">{error}</p>
              </CardBody>
            </Card>
          )}
          {stats && (
            <Card className="mb-6">
              <CardBody>
                <h2 className="text-xl font-bold mb-4">
                  Estadísticas del canal:
                </h2>
                <table className="w-full">
                  <tbody>
                    {Object.entries(stats).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="py-2 font-medium">{key}</td>
                        <td className="py-2 text-right">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <Card className="h-full">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">
                Información de depuración:
              </h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded h-[calc(100vh-200px)] overflow-auto">
                {debug}
              </pre>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
