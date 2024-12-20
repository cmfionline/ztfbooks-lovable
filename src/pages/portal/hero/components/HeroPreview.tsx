interface HeroPreviewProps {
  data?: {
    title: string;
    subtitle: string;
    primary_button_text: string;
    secondary_button_text: string;
    primary_button_link: string;
    secondary_button_link: string;
    app_store_link?: string;
    play_store_link?: string;
    hero_image?: string;
  };
}

export const HeroPreview = ({ data }: HeroPreviewProps) => {
  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hero section selected
      </div>
    );
  }

  return (
    <div className="relative bg-white py-8 px-6 rounded-lg border">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-[#141413]">
            {data.title}
          </h1>
          <p className="text-lg text-[#828179] max-w-lg">
            {data.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-[#141413] text-white rounded-lg hover:bg-[#141413]/90 transition-colors">
              {data.primary_button_text}
            </button>
            <button className="px-6 py-3 border border-[#141413] text-[#141413] rounded-lg hover:bg-[#141413]/5 transition-colors">
              {data.secondary_button_text}
            </button>
          </div>
          <div className="flex items-center gap-4 pt-4">
            {data.app_store_link && (
              <a href={data.app_store_link} className="hover:opacity-80 transition-opacity">
                <img src="/app-store.svg" alt="Download on the App Store" className="h-10" />
              </a>
            )}
            {data.play_store_link && (
              <a href={data.play_store_link} className="hover:opacity-80 transition-opacity">
                <img src="/play-store.svg" alt="Get it on Google Play" className="h-10" />
              </a>
            )}
          </div>
        </div>
        {data.hero_image && (
          <div className="relative">
            <img
              src={data.hero_image}
              alt="Hero preview"
              className="w-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};