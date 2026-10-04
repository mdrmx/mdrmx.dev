import selfie from "../assets/selfie.jpeg";

export function AboutSection() {
  return (
    <>
      <h3 className="eyebrow">[ 02 / about ]</h3>
      <br />
      <section
        className="studio-section"
        id="studio"
        aria-labelledby="studio-title"
      >
        <div className="studio-copy">
          <h2 id="studio-title">Made for Humans</h2>
          <p>
            MDRMX is Dr. Stuart Haffenden Cornejo.
            <br /> <br />A human-centric designer, developer, and researcher. I
            am passionate about creating meaningful digital experiences that
            prioritize user needs and accessibility.
            <br /> <br /> My work spans across various domains, including web
            development, generative art, interaction design, and user experience
            research. <br /> <br />I believe in the power of technology to
            democratize access to information and services, and I strive to make
            the web a safer and more inclusive space for everyone.
          </p>
          <a
            className="coordinates"
            href="https://oceanservice.noaa.gov/facts/atlantis.html"
            target="_blank"
            rel="noreferrer"
          >
            31.254 N / 24.2583 E
          </a>
        </div>
        <img
          className="studio-portrait"
          src={selfie}
          alt="Pixelated self-portrait"
        />
      </section>
    </>
  );
}
