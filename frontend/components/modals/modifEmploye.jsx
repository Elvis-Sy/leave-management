"use client"

import React, {useRef, useState, useEffect, useCallback} from 'react'
import { useForm } from 'react-hook-form';
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Autocomplete, AutocompleteItem, RadioGroup, Radio, Checkbox} from '@nextui-org/react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

const ModifEmploye = ({onClose, all, idEmploye}) => {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    //Value
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [CIN, setCin] = useState('');
    const [email, setEmail] = useState('');
    const [sexe, setSexe] = useState('');
    const [idposte, setIdPoste] = useState('');
    const [idEtablissement, setIdEtablissement] = useState('');
    const [idManager, setIdManager] = useState('');
    const [dateEmbauche, setDateEmbauche] = useState('');
    const [periodeEssai, setPeriodeEssai] = useState(false);
    const [photo, setPhoto] = useState(null)
    //
    const fileInputRef = useRef(null);
    const formRef = useRef();
    const [etab, setEtab] = useState([])
    const [postes, setPostes] = useState([])
    const [manager, setManager] = useState([])
    const [file, setFile] = useState(null)

    useEffect(()=>{
        getEtab()
        getPoste()
        getSupp()
    }, [])

    const handleSexeChange = (e) => setSexe(e.target.value);
    const handleDateEmbaucheChange = (e) => setDateEmbauche(e.target.value);
        

    //Pointage input file
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    //Changement de l'image
    const handleFileChange = (e) =>{
        const file = e.target.files[0];
        setFile(file)
    }

    const handleCheckboxChange = (e) => {
        setPeriodeEssai(e.target.checked);
        errors.dateEmbauche = null;
        if (e.target.checked) {
            setValue('dateEmbauche', e.target.checked); // Réinitialise le champ
        }
    };

    const handleButtonClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
        }
    };
  
    const getEtab = async ()=> {
    try {

        const response = await axios.get('http://localhost:5000/api/details/etablissement', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setEtab(response.data.etabi)

    } catch (error) {
        console.error("Error listage departments:", error);
        setEtab([])
    }
    }

    const getPoste = async ()=> {
        try {

            const response = await axios.get('http://localhost:5000/api/details/postes', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setPostes(response.data.poste)

        } catch (error) {
            console.error("Error listage departments:", error);
            setPostes([])
        }
    }

    const getSupp = async ()=> {
        try {

            const response = await axios.get('http://localhost:5000/api/employes/supperieur', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setManager(response.data.supp)

        } catch (error) {
            console.error("Error listage departments:", error);
            setManager([])
        }
    }

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
            } else if(data.idManager == null){
                data.idManager = ' '
            }
          })
  
          formData.append('email', data.email)
          formData.append('idposte', data.idposte)
          formData.append('nom', data.nom)
          formData.append('prenom', data.prenom)
          formData.append('sexe', sexe)
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
          console.log(Number(data.periodeEssai))
          
          const response = await axios.patch(`http://localhost:5000/api/employes/${idEmploye}`, formData, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              }
          });

          console.log(response.data.message)
  
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
  
            all()
            onClose()
            
          }
      
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire :', error);
        }
        
      };

      const Informations = useCallback(async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/employes/modif/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
    
            const info = response.data.info
            console.log(info)
            setNom(info.nom || '');
            setPrenom(info.prenom || '');
            setCin(info.CIN || '');
            setEmail(info.email || '');
            setSexe(info.sexe || '');
            setIdPoste(info.poste || '');
            setIdEtablissement(info.etablissement || '');
            setIdManager(info.manager || '');
            setDateEmbauche(info.dateEmbauche ? new Date(info.dateEmbauche).toISOString().substring(0, 10) : '');
            setPeriodeEssai(info.periodeEssai);
            setPhoto(info.photo || null)
    
            setValue('email', info.email)
            setValue('periodeEssai', info.periodeEssai)
            setValue('idposte', info.poste)
            setValue('idManager', info.manager)
            setValue('idEtablissement', info.etablissement)
            setValue('CIN', info.CIN)
            setValue('Prenom', info.prenom)
            setValue('nom', info.nom)
    
        } catch (error) {
            console.log('erreur informations: ', error.message)
        }
    }, [setValue]);

    useEffect(()=>{
        Informations(idEmploye)
    }, [Informations, idEmploye])

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className="flex flex-col gap-1 bg-bleuspat text-white">Modification</ModalHeader>
            <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} ref={formRef}> 
            <h1 className='text-bleuspat font-medium'>Informations personnelles:</h1>
            <div className="flex flex-col gap-4">
                <div className="flex items-center">
                <div className='h-full w-1/2 p-2'>
                    {/* Label pour le file */}
                    <label onClick={handleImageClick} className='group dark:text-white hover:underline flex gap-2 items-center font-semibold mb-2 text-gray-900 text-sm'>
                        <div
                            id='preview'
                            className='flex justify-center items-center w-20 h-20 rounded-full bg-gray-400 group-hover:bg-gray-500 bg-cover bg-center'
                            style={{
                                backgroundImage: file ? `url(${URL.createObjectURL(file)})` : `url(http://localhost:5000/${photo})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        ></div>
                        Joindre une photo de profil
                    </label>

                    {/* Input file */}
                    <input className='hidden' id='img' ref={fileInputRef} name='img' onChange={handleFileChange} type="file"/>
                </div>
                <div className="flex w-1/2 flex-col gap-4">
                    <Input
                        isRequired
                        value={nom}
                        onValueChange={setNom}
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
                        value={prenom}
                        onValueChange={setPrenom}
                        variant="bordered"
                        className="w-full font-semibold login"
                        {...register('prenom')}
                    />
                </div>
                </div>
                <div className="flex flex-col gap-4">
                <div className="ml-4 font-semibold">
                    <label className="block dark:text-white mb-2 text-gray-700">Genre de l&apos;employé <span className="text-red-500 text-sm">*</span> :</label>
                    <div className="">
                    <div className="flex">
                        <label className="mr-4 font-normal">
                        <input
                            type="radio"
                            value="M"
                            checked={sexe == 'M'}
                            onChange={handleSexeChange}
                            className="mr-1 text-bleuspat"
                            {...register('sexe', { required: "Le sexe est requis" })} 
                        />
                        Homme
                        </label>
                        <label className="mr-4 font-normal">
                        <input
                            type="radio"
                            value="F"
                            checked={sexe == 'F'}
                            onChange={handleSexeChange}
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
                    value={CIN}
                    onValueChange={setCin}
                    label="CIN"
                    maxLength={12}
                    min={12}
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
                value={email}
                onValueChange={setEmail}
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
                        <Image src='/maillog.png' alt='mail' width={20} height={20} className='pointer-events-none'/>
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
                selectedKey={idManager}
                onSelectionChange={setIdManager}
                {...register('idManager')}
            >
                {(item) => <AutocompleteItem value={item.value} key={item.label}>{item.label}</AutocompleteItem>}
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
                        selectedKey={idposte}
                        onSelectionChange={setIdPoste}
                        isInvalid={!!errors.idposte}
                        errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.idposte ? errors.idposte.message : ''}</span>}
                    >
                        {(item) => <AutocompleteItem value={item.value} key={item.label}>{item.label}</AutocompleteItem>}
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
                        selectedKey={idEtablissement}
                        onSelectionChange={setIdEtablissement}
                        isInvalid={!!errors.idEtablissement}
                        errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.idEtablissement ? errors.idEtablissement.message : ''}</span>}
                    >
                        {(item) => <AutocompleteItem value={item.value} key={item.label}>{item.label}</AutocompleteItem>}
                    </Autocomplete>
                </div>

                <div className="flex items-center gap-8 mt-1">
                <div className="w-1/2">
                    <div className={`${periodeEssai ? 'dark: bg-gray-100/10 bg-gray-100' : ''} group relative border-2 p-2 rounded-xl ${errors.dateEmbauche ? 'border-[#f31260] focus-within:border-[#f31260] focus-within:ring-1 focus-within:ring-[#f31260]' : 'focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] border-gray-300'}`}>
                    <label className={`block dark:text-white ${errors.dateEmbauche ? 'text-[#f31260]' : 'text-gray-700'}  text-xs font-semibold`}>
                        Date d&apos;embauche <span className="text-red-500 text-sm">*</span>
                    </label>
                    <div className="">
                        <input 
                            value={dateEmbauche ? dateEmbauche : null}
                            onChange={handleDateEmbaucheChange}
                            type="date" 
                            disabled={periodeEssai}
                            className="block bg-transparent dark:text-white w-full text-gray-700 placeholder-gray-400 focus:outline-none" 
                            placeholder="jj-mm-aaaa" 
                            required 
                            {...register('dateEmbauche', { 
                                required: "La date d'embauche est requise", 
                                setValueAs: (value) => new Date(value),
                                disabled: periodeEssai
                            })}
                        />
                    </div>
                    </div>
                    {errors.dateEmbauche && <span className="flex justify-start text-[#f31260] text-xs text-right font-medium">{errors.dateEmbauche.message}</span>}
                </div>

                <Checkbox className='w-1/2' isSelected={periodeEssai}  {...register("periodeEssai")} onChange={handleCheckboxChange}>En période d&apos;essai</Checkbox>
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
  )
}

export default ModifEmploye