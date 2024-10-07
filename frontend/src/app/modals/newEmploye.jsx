"use client"

import React, {useRef, useState} from 'react'
import { useForm } from 'react-hook-form';
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Autocomplete, AutocompleteItem, RadioGroup, Radio, Checkbox} from '@nextui-org/react'

const etab = [
    {
        label: "Informatique et telecom",
        value: 1
    },
    {
        label: "Technologique",
        value: 2
    },
]

const postes = [
    {
        label: "Directeur",
        value: 1
    },
]

const NewEmploye = () => {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [essai, setEssai] = useState(false);
    const fileInputRef = useRef(null);
    const formRef = useRef();

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
          data.photoProfile = fileInputRef.current.files[0];
          const response = await axios.post('http://localhost:5000/api/employes/ajout', data, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          console.log('Formulaire envoyé avec succès :', data);
          console.log('Etat:', response.data);
    
      } catch (error) {
          console.error('Erreur lors de la soumission du formulaire :', error);
      }
    };

    const handleButtonClick = () => {
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    };

  return (
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
                    <RadioGroup
                      isRequired
                      label="Genre de l'employe:"
                      orientation="horizontal"
                      {...register('sexe', { 
                        required: 'Le genre est requis', 
                      })}
                      isInvalid={!!errors.sexe}
                      errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.sexe ? errors.sexe.message : ''}</span>}
                      className='ml-4 font-semibold'
                    >
                      <Radio value="M" className='font-normal'>Homme</Radio>
                      <Radio value="F" className='font-normal'>Femme</Radio>
                    </RadioGroup>

                    <Input
                      isRequired
                      label="CIN"
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
                        }
                      })}
                      isInvalid={!!errors.CIN}
                      errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.CIN ? errors.CIN.message : ''}</span>}
                    />
                  </div>
                </div>
                
                <h1 className='text-bleuspat font-medium mt-2'>Informations professionnelles:</h1>
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

                  <div className="flex gap-2">
                    <Autocomplete
                      isRequired
                      variant="bordered"
                      label="Poste de travail"
                      placeholder="Recherche de poste"
                      className="w-full font-semibold auto"
                      {...register('poste', { 
                        required: 'Le poste est requis', 
                      })}
                      defaultItems={postes}
                      isInvalid={!!errors.poste}
                      errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.poste ? errors.poste.message : ''}</span>}
                    >
                      {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                    </Autocomplete>

                    <Autocomplete
                      isRequired
                      variant="bordered"
                      label="Etablissement"
                      placeholder="Direction / Departement"
                      className="w-full font-semibold auto"
                      {...register('etablissement', { 
                        required: "L'etablissement est requis", 
                      })}
                      defaultItems={etab}
                      isInvalid={!!errors.etablissement}
                      errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.etablissement ? errors.etablissement.message : ''}</span>}
                    >
                      {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
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
                  Close
                </Button>
                <Button color="primary" type='submit' onPress={handleButtonClick}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>

  )
}

export default NewEmploye