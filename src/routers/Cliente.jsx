import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'

function Cliente(){

  /* Hook useState */
  const[listaCliente, setListaCliente] = useState([]);

  /* Biblioteca de validação dos Campos */
  const scheme = yup.object({
    nome:yup.string().required("O campo Nome obrigatório"),
    email:yup.string().email("Digite um email válido").required("O campo Email obrigatório"),
    cpf:yup.string().min(11, "CPF deve conter pelo menos 11 digitos").required("Campo CPF obrigatório")
  })
  .required();

  /* Função que cria os metodos register e handleSubmit para chamar o form e validar */  
  const {register, handleSubmit, formState: {errors}, setValue, setFocus,} = useForm({
    resolver:yupResolver(scheme)
  })

  /* Função inserir cliente */
  function inserirCliente(cliente){
    setListaCliente([...listaCliente, cliente]);
  }

  /* Criando a API para ser consumida */
  function buscarCep(e){
    const cep = e.target.value.replace(/\D/g,'');
    fetch(`viacep.com.br/ws/${cep}/json/`)
      .then((res)=> res.json())
      .then((data)=>{
        setValue('rua',data.logradouro);
        setValue('bairro',data.bairro);
        setValue('cidade',data.localidade);
        setFocus('numero');
      });
  }


  return(
    <>
    <form onSubmit={handleSubmit(inserirCliente)}>
      <fieldset>
        <legend> Dados pessoais: </legend>

          <label> 
            Nome:
            <input type="text"{...register('nome')} />
            <span> {errors.nome?.message} </span>
          </label>

          <label> 
            Email:
            <input type="text"{...register('email')} />
            <span> {errors.email?.message} </span>
          </label>

          <label> 
            CPF:
            <input type="text"{...register('cpf')} />
            <span> {errors.cpf?.message} </span>
          </label>
      </fieldset>

      <fieldset> 
        <legend> Endereço: </legend>

        <label> 
          CEP:
          <input type="text" {...register('cep')} onBlur={buscarCep} />
        </label>

        <label>
          Rua:
          <input type="text" {...register('rua')} />
        </label>

        <label>
          Número:
          <input type="text" {...register('numero')} />
        </label>

        <label>
          Bairro:
          <input type="text" {...register('bairro')} />
        </label>

        <label>
          Cidade:
          <input type="text" {...register('cidade')} />
        </label>

        <div>
          <button type="submit"> Cadastrar </button>
          <button type='reset'> Limpar </button>
        </div>

      </fieldset>
    </form>
    </>
  )
}

export default Cliente