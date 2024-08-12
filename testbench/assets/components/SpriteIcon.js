export class SpriteIcon extends HTMLElement {

  sprite = './assets/icons.svg';
  symbol = 'inbox';

  connectedCallback() {

    this.classList.add('icon');

    [
      'symbol',
      'iconSprite',
      'iconClass',
    ].forEach(attr => {
      this[attr] = this.getAttribute(attr) || this[attr];
      this.removeAttribute(attr);
    });

    this.render();
      
  }

  render() {

    this.outerHTML = `
      <svg class="${this.className}">
        <use xlink:href="${this.sprite}?cachebust=${(new Date()).getTime()}#${this.symbol}"></use>
      </svg>
    `;

  }

}