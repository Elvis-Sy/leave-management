"use client"

import React, {useRef, useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Autocomplete, AutocompleteItem, RadioGroup, Radio, Checkbox} from '@nextui-org/react'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NewEmploye = ({onClose, reload}) => {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [essai, setEssai] = useState(false);
    const fileInputRef = useRef(null);
    const formRef = useRef();
    const [etab, setEtab] = useState([])
    const [postes, setPostes] = useState([])
    const [manager, setManager] = useState([])

    useEffect(()=>{
      getEtab()
      getPoste()
      getSupp()
    }, [])

    //Pointage input file
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    //Changement de l'image
    const handleFileChange = (e) =>{
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file) {

            reader.onload = function(e){
                const arrayBuffer = e.target.result;
                
                const imgPreview = document.getElementById("preview");
                imgPreview.style.backgroundImage = `url(${arrayBuffer})`;
            };
            reader.readAsDataURL(file);

        }
        
    }

    const handleCheckboxChange = (e) => {
      setEssai(e.target.checked);
      errors.dateEmbauche = null;
      if (e.target.checked) {
        setValue('dateEmbauche', ''); // Réinitialise le champ
      }
    };

    // Gestion de la soumission du formulaire
    const onSubmit = async (data) => {
      try {
        const formData = new FormData()

        etab.forEach((item)=>{
          if(data.idEtablissement == item.label){
            data.idEtablissement = Number(item.value)
          }
        })
        postes.forEach((item)=>{
          if(data.idposte == item.label){
            data.idposte = Number(item.value)
          }
        })
        manager.forEach((item)=>{
          if(data.idManager == item.label){
            data.idManager = Number(item.value)
          }
        })

        formData.append('email', data.email)
        formData.append('idposte', data.idposte)
        formData.append('nom', data.nom)
        formData.append('prenom', data.prenom)
        formData.append('sexe', data.sexe)
        formData.append('CIN', Number(data.CIN))
        if(data.dateEmbauche){
          formData.append('dateEmbauche', data.dateEmbauche)
        }
        if(data.idManager){
          formData.append('idManager', data.idManager)
        }
        formData.append('periodeEssai', Number(data.periodeEssai))
        formData.append('idEtablissement', Number(data.idEtablissement))
        formData.append('photoProfile', fileInputRef.current.files[0])
        
        const response = await axios.post('http://localhost:5000/api/employes/ajout', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if(response.data.cause){
          toast.warn(`${response.data.cause}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {width: "120%", fontWeight: "bolder"}
          });
        } else {
          toast.success(`${response.data.message}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {fontSize: "bolder", fontWeight: "bolder"}
          });


          reload()
          onClose()          
        }
    
      } catch (error) {
          console.error('Erreur lors de la soumission du formulaire :', error);
      }
      
    };

    const handleButtonClick = () => {
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    };

    const getEtab = async ()=> {
      try {

        const response = await axios.get('http://localhost:5000/api/details/etablissement');

        setEtab(response.data.etabi)

      } catch (error) {
        console.error("Error listage departments:", error);
        setEtab([])
      }
    }

    const getPoste = async ()=> {
      try {

        const response = await axios.get('http://localhost:5000/api/details/postes');

        setPostes(response.data.poste)

      } catch (error) {
        console.error("Error listage departments:", error);
        setPostes([])
      }
    }

    const getSupp = async ()=> {
      try {

        const response = await axios.get('http://localhost:5000/api/employes/supperieur');

        setManager(response.data.supp)

      } catch (error) {
        console.error("Error listage departments:", error);
        setManager([])
      }
    }


  return (
      <>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-bleuspat text-white">Nouvel(le) Employé(e)</ModalHeader>
              <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)} ref={formRef}> 
                <h1 className='text-bleuspat font-medium'>Informations personnelles:</h1>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center">
                    <div className='h-full w-1/2 p-2'>
                        {/* Label pour le file */}
                        <label onClick={handleImageClick} className='group hover:underline flex gap-2 items-center font-semibold mb-2 text-gray-900 text-sm'>
                        <div id='preview' className='flex justify-center items-center w-20 h-20 rounded-full bg-gray-400 group-hover:bg-gray-500 bg-cover bg-center'>
                        </div>
                            Joindre une photo de profil
                        </label>

                        {/* Input file */}
                        <input className='hidden' id='img' ref={fileInputRef} name='img' onChange={handleFileChange} type="file"/>
                    </div>
                    <div className="flex w-1/2 flex-col gap-4">
                      <Input
                          isRequired
                          label="Nom"
                          variant="bordered"
                          className="w-full font-semibold login"
                          {...register('nom', { 
                              required: 'Le nom est requis', 
                          })}
                          isInvalid={!!errors.nom}
                          errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.nom ? errors.nom.message : ''}</span>}
                      />

                      <Input
                          label="Prenom"
                          variant="bordered"
                          className="w-full font-semibold login"
                          {...register('prenom')}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                  <div className="ml-4 font-semibold">
                      <label className="block mb-2 text-gray-700">Genre de l'employé <span className="text-red-500 text-sm">*</span> :</label>
                      <div className="">
                        <div className="flex">
                          <label className="mr-4 font-normal">
                            <input
                              type="radio"
                              value="M"
                              className="mr-1 text-bleuspat"
                              {...register('sexe', { required: "Le sexe est requis" })} 
                            />
                            Homme
                          </label>
                          <label className="mr-4 font-normal">
                            <input
                              type="radio"
                              value="F"
                              className="mr-1 text-bleuspat"
                              {...register('sexe', { required: "Le sexe est requis" })} 
                            />
                            Femme
                          </label>
                        </div>
                      </div>
                      {errors.sexe && <span className="flex justify-start text-[#f31260] text-xs text-right">{errors.sexe.message}</span>}
                    </div>

                    <Input
                      isRequired
                      label="CIN"
                      maxLength={12}
                      variant="bordered"
                      className="font-semibold login"
                      {...register('CIN', {
                        required: 'Le CIN est requis',
                        minLength: {
                          value: 12,
                          message: 'Le CIN doit contenir exactement 12 caractères'
                        },
                        maxLength: {
                          value: 12,
                          message: 'Le CIN doit contenir exactement 12 caractères'
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Le champ doit contenir uniquement des chiffres'
                        },
                        setValueAs: (value) => Number(value)
                      })}
                      isInvalid={!!errors.CIN}
                      errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.CIN ? errors.CIN.message : ''}</span>}
                    />
                  </div>
                </div>
                
                <h1 className='text-bleuspat font-medium my-2'>Informations professionnelles:</h1>
                <div className="">
                  <Input
                    isRequired
                    label="Email"
                    variant="bordered"
                    className="w-full font-semibold login"
                    {...register('email', { 
                      required: 'Email requis', 
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Entrer un email valide'
                      }
                    })}
                    endContent={
                      <div className='flex h-full items-center'>
                        <img src='/maillog.png' width={20} height={20} className='pointer-events-none'/>
                      </div>
                    }
                    isInvalid={!!errors.email}
                    errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.email ? errors.email.message : ''}</span>} 
                  />

                <Autocomplete
                  variant="bordered"
                  label="Manager"
                  placeholder="Sous la subordination de..."
                  className="w-full font-semibold auto mb-2"
                  defaultItems={manager}
                  {...register('idManager')}
                >
                  {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>

                  <div className="flex gap-2">
                    <Autocomplete
                      isRequired
                      variant="bordered"
                      label="Poste de travail"
                      placeholder="Recherche de poste"
                      className="w-full font-semibold auto"
                      {...register('idposte', { 
                        required: 'Le poste est requis', 
                      })}
                      defaultItems={postes}
                      isInvalid={!!errors.idposte}
                      errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.idposte ? errors.idposte.message : ''}</span>}
                    >
                      {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                    </Autocomplete>

                    <Autocomplete
                      isRequired
                      variant="bordered"
                      label="Etablissement"
                      placeholder="Direction / Departement"
                      className="w-full font-semibold auto"
                      defaultItems={etab}
                      {...register('idEtablissement', { 
                        required: "L'etablissement est requis", 
                      })}
                      isInvalid={!!errors.idEtablissement}
                      errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.idEtablissement ? errors.idEtablissement.message : ''}</span>}
                    >
                      {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                    </Autocomplete>
                  </div>

                  <div className="flex items-center gap-8 mt-1">
                    <div className="w-1/2">
                      <div className={`${essai ? 'bg-gray-100' : ''} group relative border-2 p-2 rounded-xl ${errors.dateEmbauche ? 'border-[#f31260] focus-within:border-[#f31260] focus-within:ring-1 focus-within:ring-[#f31260]' : 'focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] border-gray-300'}`}>
                        <label className={`block ${errors.dateEmbauche ? 'text-[#f31260]' : 'text-gray-700'}  text-xs font-semibold`}>
                          Date d'embauche <span className="text-red-500 text-sm">*</span>
                        </label>
                        <div className="">
                          <input 
                            disabled={essai}
                            type="date" 
                            className="block w-full text-gray-700 placeholder-gray-400 focus:outline-none" 
                            placeholder="jj-mm-aaaa" 
                            required 
                            {...register('dateEmbauche', { 
                              required: "La date d'embauche est requise", 
                              setValueAs: (value) => new Date(value),
                              disabled: essai
                            })}
                          />
                        </div>
                      </div>
                      {errors.dateEmbauche && <span className="flex justify-start text-[#f31260] text-xs text-right font-medium">{errors.dateEmbauche.message}</span>}
                    </div>

                    <Checkbox className='w-1/2' {...register("periodeEssai")} onChange={handleCheckboxChange}>En période d'essai</Checkbox>
                  </div>
                </div>
              </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button color="primary" type='submit' onPress={handleButtonClick}>
                  Enregistrer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </>
  )
}

export default NewEmploye