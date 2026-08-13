import { Link } from 'react-router-dom';

const WelcomeBanner = (props) => {
  return (
    <section>
      <h1>Welcome, {props.name}! 👋</h1>
      <p>Prepare for your dream placement.</p>
    </section>
  );
};

export default WelcomeBanner;