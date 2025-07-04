
import { HeroButton } from "@/lib/types";

type Props = {
  title: string;
  subtitle: string;
  primaryBtn: HeroButton;
  secondaryBtn: HeroButton;
  imageUrl: string;
};

const HeroSection = ({ title, subtitle, primaryBtn, secondaryBtn, imageUrl }: Props) => {
  return (
    <section className='hero' style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="hero__overlay"></div> 
            <div className="hero__container">
                <h1 className="hero__title mb-4">
                    {title}
                </h1>
                <p className="hero__subtitle">
                    {subtitle}
                </p>
                <div className="hero__cta mt-6">
                    <a href={primaryBtn.url} className="btn btn-primary">
                        {primaryBtn.text}
                    </a>  
                    <a href={secondaryBtn.url} className="btn btn-secondary ml-4">
                        {secondaryBtn.text} 
                    </a>
                </div>
            
        </div>
    </section>
  )
}

export default HeroSection