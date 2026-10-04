import { Heart, Menu, type LucideProps } from "lucide-react";
import githubLogo from "@mangowm/assets/logos/github.svg";
import githubWhiteLogo from "@mangowm/assets/logos/github-white.svg";
import discordLogo from "@mangowm/assets/logos/discord.svg";
import discordWhiteLogo from "@mangowm/assets/logos/discord-white.svg";

export function GithubIcon() {
  return (
    <span className="inline-flex items-center">
      <img src={githubLogo} alt="" aria-hidden="true" className="github-light w-5 h-5" />
      <img src={githubWhiteLogo} alt="" aria-hidden="true" className="github-dark w-5 h-5" />
    </span>
  );
}

export function DiscordIcon() {
  return (
    <span className="inline-flex items-center">
      <img src={discordLogo} alt="" aria-hidden="true" className="discord-light w-5 h-5" />
      <img src={discordWhiteLogo} alt="" aria-hidden="true" className="discord-dark w-5 h-5" />
    </span>
  );
}

export const HeartSvg = (props: LucideProps) => <Heart {...props} />;

export const MenuSvg = (props: LucideProps) => <Menu {...props} />;
