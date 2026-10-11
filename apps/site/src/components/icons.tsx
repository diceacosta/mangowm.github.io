import { Heart, Menu, type LucideProps } from "lucide-react";
import githubLogo from "@mangowm/assets/logos/github.svg";
import githubWhiteLogo from "@mangowm/assets/logos/github-white.svg";
import discordLogo from "@mangowm/assets/logos/discord.svg";
import discordWhiteLogo from "@mangowm/assets/logos/discord-white.svg";

export function GithubIcon() {
  return (
    <span className="inline-flex items-center">
      <img src={githubLogo} alt="" aria-hidden="true" className="github-light size-[1.125rem]" />
      <img
        src={githubWhiteLogo}
        alt=""
        aria-hidden="true"
        className="github-dark size-[1.125rem]"
      />
    </span>
  );
}

export function DiscordIcon() {
  return (
    <span className="inline-flex items-center">
      <img src={discordLogo} alt="" aria-hidden="true" className="discord-light size-[1.125rem]" />
      <img
        src={discordWhiteLogo}
        alt=""
        aria-hidden="true"
        className="discord-dark size-[1.125rem]"
      />
    </span>
  );
}

export const HeartSvg = (props: LucideProps) => <Heart {...props} />;

export const MenuSvg = (props: LucideProps) => <Menu {...props} />;
