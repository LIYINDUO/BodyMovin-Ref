import React, { Component } from 'react';
import bodymovin from 'bodymovin';
import logo from './logo.svg';
import hpAnimation from './hpAnimation.json';
import './App.scss';

class App extends Component {
   constructor(props) {
    super(props);
    this.state = {
      language: {
        english: {
            firstPara: [`Edit`, `and save to reload.`]
        },
        simplifiedChinese: {
           firstPara: [`更改`, `来进行存储与重制`]  
        }
      },
      currentLanguage: "english"
    }
  }
  
  // properties
  
  animationIsAttached = false; 
  // lifecycle 
  componentDidMount () {
    this.attachAnimation()
  }
  
  attachAnimation = () => {
      if (this.animationContainer !== undefined && !this.animationIsAttached) {
        const animationProperties = {
          container: this.animationContainer,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          autoloadSegments: false,
          animationData: hpAnimation
        }
        
        this.anim = bodymovin.loadAnimation(animationProperties);
        this.anim.addEventListener('DOMLoaded',this.startAnimation);
        this.animationContainer.addEventListener('mouseover', this.readyAnimation);
        this.animationContainer.addEventListener('mouseout', this.startAnimation);
        this.anim.setSpeed(0.2);
        this.isAnimating = false;
        this.isSwirling = false;
        this.swirlingRight = true;
      }
  }
  
  startAnimation = () => {
    if(this.isSwirling) {
      this.isSwirling = false;
      this.anim.removeEventListener('loopComplete',this.readyAnimation);
    }
    this.anim.goToAndStop(7, true);
  }
  
  readyAnimation = () => {
    if(!this.isSwirling) {
      this.isSwirling = true;
      this.anim.addEventListener('loopComplete',this.readyAnimation);
    }
    if(this.swirlingRight) {
     this.swirlingRight = false;
     this.anim.playSegments([7,18],true);
    }
    else {
      this.swirlingRight = true;
      this.anim.playSegments([18,7],true);
    }
  }

  castSpell = () => {
    if(this.isAnimating){
            return;
    }
    if(this.isSwirling) {
      this.anim.removeEventListener('loopComplete',this.readyAnimation);
      this.isSwirling = false;
    }
    this.isAnimating = true;
    this.animationContainer.removeEventListener('mouseover', this.readyAnimation);
    this.animationContainer.removeEventListener('mouseout', this.startAnimation);
    this.anim.setSpeed(1);
    this.anim.playSegments([10,100],true);
    this.imgElement.classList.add("Active");
    this.anim.addEventListener('loopComplete',this.castSpellComplete);
  }
  
   castSpellComplete = () => {
    this.anim.stop();
    this.animationContainer.style.display = "none"
    this.isAnimating = false;
    this.anim.removeEventListener('loopComplete',this.castSpellComplete);
  }
  
  
  
  render() {
    const language = this.state.language[this.state.currentLanguage];
    return (
      <div className="App">
          <div className="App-lang">
            <a onClick={() => this.setState({currentLanguage: "english"})}>English</a>
            <a onClick={() => this.setState({currentLanguage: "simplifiedChinese"})}>Chinese</a>
          </div>
        <header className="App-header">
          <p key="firstPara">
            {language.firstPara[0]} <code>src/App.js</code> {language.firstPara[1]}
          </p>
          <div className="Animation">
            <div className="Animation-div" 
                 ref={(animationDiv) => { this.animationContainer = animationDiv; }}
                 onClick={this.castSpell}>
            </div>
            <img src={logo} 
                 className="Animation-logo" 
                 alt="logo" 
                 ref={(imgElement) => { this.imgElement = imgElement; }}>
            </img>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
