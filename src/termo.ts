import { VerificacaoDaLetraEnum } from "./verificacao-letra-enum.js";

const palavras: string[] = [
  "acido", "adiar", "impar", "algar", "amado", "amigo", "anexo", "anuir", "aonde", "apelo",
  "aquem", "argil", "arroz", "assar", "atras", "avido", "azeri", "babar", "bagre", "banho",
  "barco", "bicho", "bolor", "brasa", "brava", "brisa", "bruto", "bulir", "caixa", "cansa",
  "chato", "chave", "chefe", "choro", "chulo", "claro", "cobre", "corte", "curar", "deixo",
  "dizer", "dogma", "dores", "duque", "enfim", "estou", "exame", "falar", "fardo", "farto",
  "fatal", "feliz", "ficar", "fogue", "força", "forno", "fraco", "fugir", "fundo", "furia",
  "gaita", "gasto", "geada", "gelar", "gosto", "grito", "gueto", "honra", "humor", "idade",
  "ideia", "idolo", "igual", "imune", "indio", "ingua", "irado", "isola", "janta", "jovem",
  "juizo", "largo", "laser", "leite", "lento", "lerdo", "levar", "lidar", "lindo", "lirio",
  "longe", "luzes", "magro", "maior", "malte", "mamar", "manto", "marca", "matar", "meigo",
  "meios", "melao", "mesmo", "metro", "mimos", "moeda", "moita", "molho", "morno", "morro",
  "motim", "muito", "mural", "naipe", "nasci", "natal", "naval", "ninar", "nivel", "nobre",
  "noite", "norte", "nuvem", "oeste", "ombro", "ordem", "orgao", "osseo", "ossos", "outro",
  "ouvir", "palma", "pardo", "passe", "patio", "peito", "pêlos", "perdo", "peril", "perto",
  "pezar", "piano", "picar", "pilar", "pingo", "pione", "pista", "poder", "porem", "prado",
  "prato", "prazo", "preço", "prima", "primo", "pular", "quero", "quota", "raiva", "rampa",
  "rango", "reais", "reino", "rezar", "risco", "roçar", "rosto", "roubo", "russo", "saber",
  "sacar", "salto", "samba", "santo", "selar", "selos", "senso", "serao", "serra", "servo",
  "sexta", "sinal", "sobra", "sobre", "socio", "sorte", "subir", "sujei", "sujos", "talao",
  "talha", "tanga", "tarde", "tempo", "tenho", "terço", "terra", "tesao", "tocar", "lacre",
  "laico", "lamba", "lambo", "largo", "larva", "lasca", "laser", "laura", "lavra", "leigo",
  "leite", "leito", "leiva", "lenho", "lento", "leque", "lerdo", "lesao", "lesma", "levar",
  "libra", "limbo", "lindo", "lineo", "lirio", "lisar", "lista", "livro", "logar", "lombo",
  "lotes", "louca", "louco", "louro", "lugar", "luzes", "macio", "maçom", "maior", "malha",
  "malte", "mamar", "mamae", "manto", "março", "maria", "marra", "marta", "matar", "medir",
  "meigo", "meios", "melao", "menta", "menti", "mesmo", "metro", "miado", "midia", "mielo",
  "mielo", "milho", "mimos", "minar", "minha", "miolo", "mirar", "missa", "mitos", "moeda",
  "moido", "moita", "molde", "molho", "monar", "monja", "moral", "morar", "morda", "morfo",
  "morte", "mosca", "mosco", "motim", "motor", "mudar", "muito", "mular", "mulas", "mumia",
  "mural", "extra", "falar", "falta", "fardo", "farol", "farto", "fatal", "feixe", "festa",
  "feudo", "fezes", "fiapo", "fibra", "ficha", "fidel", "filao", "filho", "firma", "fisco",
  "fisga", "fluir", "força", "forma", "forte", "fraco", "frade", "friso", "frito", "fugaz",
  "fugir", "fundo", "furor", "furto", "fuzil", "gabar", "gaita", "galho", "ganho", "garoa",
  "garra", "garro", "garvo", "gasto", "gaupe", "gazua", "geada", "gemer", "germe", "gigas",
  "girar", "gizar", "globo", "gosto", "graos", "graça", "grava", "grito", "grude", "haver",
  "haver", "hiato", "hidra", "hifen", "himel", "horas", "hotel", "humor", "ideal", "idolo",
  "igual", "ileso", "imune", "irado", "isola", "jarra", "jaula", "jegue", "jeito", "jogar",
  "jovem", "juiza", "juizo", "julho", "junho", "jurar", "justa" ];

export class Termo {
  palavraSecreta: string = "";
  tentativas: number = 0;
  mensagemFinal: string = "";

  constructor() 
  {
    this.palavraSecreta = this.obterPalavra();
  }

  public avaliar(palavra: string): VerificacaoDaLetraEnum[] | null 
  {
    if (palavra.length !== 5)
      return null;

    this.tentativas++;

    const avaliacoes: VerificacaoDaLetraEnum[] = new Array(palavra.length);

    for (let i = 0; i < palavra.length; i++) 
    {
      if (palavra[i] === this.palavraSecreta[i]) 
      {
        avaliacoes[i] = VerificacaoDaLetraEnum.Correta;
      } 
      else if (this.palavraSecreta.includes(palavra[i])) 
      {
        avaliacoes[i] = VerificacaoDaLetraEnum.PosicaoErrada;
      } 
      else 
      {
        avaliacoes[i] = VerificacaoDaLetraEnum.NaoExiste;
      }
    }

    if (avaliacoes.every((a) => a === VerificacaoDaLetraEnum.Correta)) 
    {
      this.mensagemFinal = `Você acertou a palavra ${this.palavraSecreta}, parabéns!`;
    } 
    else if (this.jogadorPerdeu()) 
    {
      this.mensagemFinal = `Você perdeu! A palavra era ${this.palavraSecreta}. Tente novamente...`;
    }

    return avaliacoes;
  }

  public jogadorAcertou(palavra: string): boolean 
  {
    return palavra === this.palavraSecreta;
  }

  public jogadorPerdeu(): boolean 
  {
    return this.tentativas === 5;
  }

  private obterPalavra(): string 
  {
    const indiceAleatorio: number = Math.floor(Math.random() * palavras.length);

    return palavras[indiceAleatorio].toUpperCase();
  }
}
