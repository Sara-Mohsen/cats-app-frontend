import Link from "next/link";

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to our Cats App</h1>

        <p className="hero-description">
          A Small Network That All Cats Lovers Need!!
        </p>

        <div className="hero-buttons" >
          <Link href="/login">
            <button className="btn-primary">Sign up</button>
          </Link>

          <Link href="/home">
            <button className="btn-secondary">Veiw Cats</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
