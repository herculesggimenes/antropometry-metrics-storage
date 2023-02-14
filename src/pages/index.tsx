'use client';
import { Card, TextField, Box, Divider, InputAdornment, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Snackbar, Alert } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import {api} from '../utils/api'
import { useState, useEffect, SyntheticEvent } from "react";
import { Result } from "../types/result";
import { MEDIDAS_ANTROPOMETRICAS } from "../utils/globals";
import { downloadFile, isNumeric } from "../utils/helperFunctions";
import { publicProcedure } from "../server/api/trpc";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const [genero, setGenero] = useState("homem")
  const [error, setError] = useState(false)
  const [value, setValue] = useState<string>("")
  const [ordem, setOrdem] = useState(0)
  const [mediaEscolhida, setMediaEscolhida] = useState<string | undefined>("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState("success")
  const postMutation = api.results.publish.useMutation()
  const downloadBaseMutation = api.results.getAll.useMutation({
    
    onSuccess:(data,variables)=> {
      
      console.log(data)
      const headers = [
        "id",
        "gender",
        "m_1_1",
        "m_1_2",
        "m_1_3",
        "m_1_4",
        "m_1_5",
        "m_1_6",
        "m_1_7",
        "m_1_8",
        "m_1_9",
        "m_1_10",
        "m_2_1",
        "m_2_2",
        "m_2_3",
        "m_2_4",
        "m_2_5",
        "m_2_6",
        "m_2_7",
        "m_2_8",
        "m_2_9",
        "m_2_10",
        "m_2_11",
        "m_2_12",
        "m_2_13",
        "m_3_1",
        "m_3_2",
        "m_3_3",
        "m_3_4",
        "m_3_5",
        "m_4_1",
        "m_4_2",
        "m_4_3",
        "m_4_4",
        "m_4_5",
        "m_4_6",
        "m_4_7",
        "m_5_1",
        "m_5_2",
        "m_5_3",
        "createdAt"
      ].join(',')

      const resultsCsv = data.reduce((acc: string[], result: { [x: string]: any; }) => {
        acc.push([
          result["id"],
          result["gender"],
          result["m_1_1"],
          result["m_1_2"],
          result["m_1_3"],
          result["m_1_4"],
          result["m_1_5"],
          result["m_1_6"],
          result["m_1_7"],
          result["m_1_8"],
          result["m_1_9"],
          result["m_1_10"],
          result["m_2_1"],
          result["m_2_2"],
          result["m_2_3"],
          result["m_2_4"],
          result["m_2_5"],
          result["m_2_6"],
          result["m_2_7"],
          result["m_2_8"],
          result["m_2_9"],
          result["m_2_10"],
          result["m_2_11"],
          result["m_2_12"],
          result["m_2_13"],
          result["m_3_1"],
          result["m_3_2"],
          result["m_3_3"],
          result["m_3_4"],
          result["m_3_5"],
          result["m_4_1"],
          result["m_4_2"],
          result["m_4_3"],
          result["m_4_4"],
          result["m_4_5"],
          result["m_4_6"],
          result["m_4_7"],
          result["m_5_1"],
          result["m_5_2"],
          result["m_5_3"],
          result["createdAt"],
        ].join(','))
        return acc
      },[])
      
        downloadFile({
          data: [headers,...resultsCsv].join('\n'),
          fileName: 'resultados.csv',
          fileType: 'text/csv',
        })
      }})
      
      const handleDownloadMutation = async () => {
        let result = await downloadBaseMutation.mutate()
        
      }
      
      const handleMedidaEscolhida = (next: boolean) => {
        if (error){
          return
        }
        if (ordem === MEDIDAS_ANTROPOMETRICAS.length -1 && next){
          const result: Result = {}
          for(let i=0; i< MEDIDAS_ANTROPOMETRICAS.length;i++){
            const medida = MEDIDAS_ANTROPOMETRICAS[i] 
            if (!medida){
              return
            }
            const savedItem = localStorage.getItem(medida.ordem.toString())
            if (!savedItem){
              setMessage(`Erro na medida ${medida.item}`)
              setSeverity('error')
              setSnackbarOpen(true)

              return
            }
            //@ts-ignore
            result[`m_${medida.item.replace('.','_')}`] = Number(savedItem)
            
          }
          result.gender = genero
          //@ts-ignore
          const response = postMutation.mutate(result)
          setMessage("Sucesso ao Enviar Resposta, Voltando ao Início...")
          setSeverity("success")
          setSnackbarOpen(true)
          setOrdem(0)
          localStorage.clear()
          return
        }
        if (value){
          localStorage.setItem(ordem.toString(),value.replace(',','.'))
        }
        
        if (next){ 
          setOrdem(ordem + 1)
          localStorage.setItem("ordem",(ordem+1).toString())
        }else{
          setOrdem(ordem -1)
          localStorage.setItem("ordem",(ordem-1).toString())
        }
      }
      
      const handleSnackbarClose = () => {
        setSnackbarOpen(false)
      }
      
      useEffect(()=>{
        const cacheOrdem = localStorage.getItem("ordem")
        if (cacheOrdem){
          setOrdem(Number(cacheOrdem))
        }
      },[])
      
      useEffect(() => {
        const nextValue = localStorage.getItem(ordem.toString())
        if (nextValue){
          setValue(nextValue)
        }else{
          setValue("")
        }
        
        if (MEDIDAS_ANTROPOMETRICAS.length <= ordem || !MEDIDAS_ANTROPOMETRICAS[ordem]){
          return
        }
        if (genero === 'homem'){
          setMediaEscolhida(MEDIDAS_ANTROPOMETRICAS[ordem]?.mediaHomem.toLocaleString())
          return
        }
        setMediaEscolhida(MEDIDAS_ANTROPOMETRICAS[ordem]?.mediaMulher.toLocaleString())
      }, [genero, ordem])
      
      return (
        <>
        <Head>
        <title>Antropometria</title>
        <meta name="description" content="Medidas Antropometricas Eng Prod" />
        <link rel="icon" href="https://engprod.ufpr.br/wp-content/themes/wpufpr_zurb6_tema2/images/icons/favicon.ico"/>
        
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-sky-50">
        <Card className="flex h-[80vh] w-[80vw] flex-col m-5 p-5 justify-between">
        <div>
        <div className="flex item-center justify-between">
        <p className="font-mono">Medidas Antropométricas </p>
        <FormControl className="pl-2">
        <FormLabel id="demo-row-radio-buttons-group-label" className="font-mono text-xs" sx={{
          '& .MuiSvgIcon-root': {
            fontSize: 28,
            fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          },
        }}>Gênero</FormLabel>
        <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue={"homem"}
        >
        <FormControlLabel className="font-mono text-xs p-0" value="homem"  sx={{
          '& .css-ahj2mt-MuiTypography-root': {
            fontSize: 14,
            paddingX:1,
            fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          },
        }} 
        control={<Radio className="p-0" size="small" onChange={(event,checked) => {
          if(checked){
            setGenero("homem")
          }  
        }}/>}
        label="Masc" />
        <FormControlLabel className="font-mono text-xs p-0" value="mulher"  sx={{
          '& .css-ahj2mt-MuiTypography-root': {
            fontSize: 14,
            paddingX:1,
            fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          },
        }} control={<Radio className="p-0"  size="small" onChange={(event,checked) => {
          if(checked){
            setGenero("mulher")
          }
          
        }}/>} label="Fem" />
        </RadioGroup>
        </FormControl>  
        </div>
        <Divider className="my-2"/>
        </div>
        <div className="flex flex-col h-full w-full justify-between">
        <h1 className="max-h-15 w-full justify-center font-mono pb-6">Item {MEDIDAS_ANTROPOMETRICAS[ordem]?.item} - {MEDIDAS_ANTROPOMETRICAS[ordem]?.nome}</h1>
        <div className="max-h-[80%] grid grid-cols-1 md:grid-cols-2">
        <img className="h-60 md:h-96 w-full  max-w-md" src={`/images/${MEDIDAS_ANTROPOMETRICAS[ordem]?.item}.png`}/>
        <div className=" flex flex-col h-full w-full p-3 justify-center">
        <TextField
        InputProps={{
          endAdornment: <InputAdornment position="start" sx={{fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}}>cm</InputAdornment>,
        }}
        error={error}
        variant="standard"
        value={value}
        onChange={(event) => {
          let value = event.target.value
          setError(false)
          if (value && !isNumeric(value.replace(',','.'))){
            setError(true)
          }
          if (Number(value)< Number(mediaEscolhida?.replace(',','.'))/ 4 || Number(value) > Number(mediaEscolhida?.replace(',','.')) * 2.5){
            setError(true)
          }
          
          setValue(value)
        }}
        helperText={`Valor médio para gênero: ${mediaEscolhida}`}
        className="w-full font-mono"
        />
        </div>
        </div>
        <Divider className="mt-5"/>
        <div className="flex justify-between">
        <Button className="font-mono" onClick={() =>handleMedidaEscolhida(false)} disabled={ordem === 0 ? true : false}>Anterior</Button>
        {ordem == 0 &&
          <Button className="font-mono" onClick={handleDownloadMutation}>Baixar Base</Button>
        }
        <Button className="font-mono" disabled={error} onClick={() =>handleMedidaEscolhida(true)}>{ordem === MEDIDAS_ANTROPOMETRICAS.length - 1 ?'Submeter' : "Proximo"}</Button>
        </div>
        </div>
        </Card>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
        </Snackbar>
        </main>
        </>
        );
      };
      
      export default Home;
      